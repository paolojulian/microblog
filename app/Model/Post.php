<?php

class Post extends AppModel
{
    public $actsAs = ['SoftDeletable', 'Containable'];
    public $validate = [
        'user_id' => [
            'rule' => 'notBlank',
            'required' => true
        ],
        'title' => [
            'maxlength' => [
                'rule' => ['maxLength', 30],
                'message' => 'Only 30 characters is allowed.',
                'required' => true
            ],
        ],
        'body' => [
            'notBlank' => [
                'rule' => ['notBlank'],
                'required' => true,
                'message' => 'Please enter your message'
            ],
            'maxlength' => [
                'rule' => ['maxLength', 140],
                'message' => 'Only 140 characters is allowed.',
                'required' => true
            ],
        ],
    ];

    public $hasMany = [
        'Likes' => [
            'className' => 'Like',
            'fields' => ['user_id'],
            'conditions' =>['Likes.deleted' => null]
        ],
        'Comments' => [
            'className' => 'Comment',
            'order' => 'Comments.created DESC',
            'limit' => 20,
            'conditions' =>['Comments.deleted' => null],
        ],
    ];

    public $belongsTo = [
        'User' => [
            'className' => 'User',
            'fields' => ['username', 'avatar_url']
        ],
    ];

    /**
     * TODO make subquery to joins and where
     */
    public function fetchPostsOfUser($userId, $pageNo = 1, $perPage = 5)
    {
        $offset = ($pageNo - 1) * $perPage;
        $procedure = "CALL fetchPostsOfUser($userId, $perPage, $offset)";
        $data = $this->query($procedure);
        $this->getLikesAndComments($data);
        return $data;
    }

    /**
     * TODO make subquery to joins and where
     */
    public function fetchPostsToDisplay($userId, $pageNo = 1, $perPage = 5)
    {
        $offset = ($pageNo - 1) * $perPage;
        $procedure = "CALL fetchPostsToDisplay($userId, $perPage, $offset)";
        $data = $this->query($procedure);
        $this->getLikesAndComments($data);
        return $data;
    }

    private function getLikesAndComments(&$data)
    {
        foreach ($data as $key => $item) {
            $data[$key]['Post']['likes'] = $this->getLikes($item['Post']['id']);
            $data[$key]['Post']['comments'] = $this->Comments->countPerPost($item['Post']['id']);
        }
    }

    public function fetchPostsWithComments($postId)
    {
        if ( ! $post = $this->findById($postId)) {
            throw new NotFoundException(__('Invalid post'));
        }
        $post['isShared'] = $post['Post']['retweet_post_id'] != null;

        $post['Post']['comments'] = $this->Comments->countPerPost($post['Post']['id']);

        $post['Post']['likes'] = array_map(function ($like) {
            return $like['user_id'];
        }, $post['Likes']);

        foreach ($post['Comments'] as $key => $comment) {
            $commentUser = $this->User->find('first', [
                'recursive' => -1,
                'fields' => ['username', 'avatar_url'],
                'conditions' => ['id' => $comment['user_id']]
            ]);
            $post['Comments'][$key]['username'] = $commentUser['User']['username'];
            $post['Comments'][$key]['avatarUrl'] = $commentUser['User']['avatar_url'];
        }

        // Check if post is a shared post
        // Gets information about the shared post instead
        if ($post['isShared']) {
            $originalPost = $this->find('first', [
                'recursive' => -1,
                'contain' => ['User.username', 'User.avatar_url'],
                'conditions' => ['Post.id' => $post['Post']['retweet_post_id']]
            ]);
            if ( ! $originalPost) {
                throw new NotFoundException(__('Invalid post'));
            }
            $post['Original'] = $originalPost;
            return $post;
        }
        return $post;
    }

    public function getLikes($postId)
    {
        return array_values($this->Likes->find('list', [
            'fields' => ['user_id'],
            'conditions' => ['post_id' => $postId]
        ]));
    }

    public function addPost($data)
    {
        $this->set($data);
        if ( ! $this->validates()) {
            return false;
        }
        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        return true;
    }

    public function editPost($postId, $data)
    {
        $this->id = $postId;
        $this->set($data);
        $post = $this->find('first', [
            'fields' => ['retweet_post_id'],
            'recursive' => -1,
            'condition' => ['id' => $postId]
        ]);
        if ($post["Post"]["retweet_post_id"]) {
            $this->validator()->remove('body', 'notBlank');
        }
        if ( ! $this->validates()) {
            return false;
        }
        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        return true;
    }

    public function sharePost($postId, $userId, $data)
    {
        $post = $this->hasAny(['id' => $postId]);
        if ( ! $post) {
            throw new NotFoundException();
        }
        $this->validator()->remove('title');
        $this->validator()->remove('body', 'notBlank');
        $this->set([
            'retweet_post_id' => $postId,
            'user_id' => $userId,
            'body' => $data['body']
        ]);
        if ( ! $this->validates()) {
            return false;
        }
        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        $Notification = ClassRegistry::init('Notification');
        $receiver_id = $this->field('user_id', ['id' => $postId]);
        $postId = $postId;
        if ($receiver_id != $userId) {
            $Notification->addNotification([
                'type' => 'shared',
                'receiver_id' => $receiver_id,
                'user_id' => $userId,
                'post_id' => $postId
            ]);
        }
        return true;
    }

    /**
     * Fetches posts by given searchText
     * 
     * @param string $searchText - text to be searched
     * @param int $page - page no.
     */
    public function searchPost($searchText, $page = 1)
    {
        $perPage = 5;
        $searchText = trim($searchText);
        $conditions = [
            'OR' => [
                'title LIKE' => "%$searchText%",
                'body LIKE' => "%$searchText%",
            ],
        ];
        $totalPosts = $this->find('count', ['conditions' => $conditions]);
        $posts = $this->find('all', [
            'contain' => ['User'],
            'conditions' => $conditions,
            'order' => 'Post.created DESC',
            'limit' => $perPage,
            'page' => $page
        ]);
        $totalLeft = $totalPosts - ($perPage * $page);
        return [
            'list' => $posts,
            'totalPosts' => $totalPosts,
            'totalLeft' => $totalLeft > 0 ? $totalLeft : 0
        ];
    }

    public function isOwnedBy($postId, $userId)
    {
        $params = [
            'id' => $postId,
            'user_id' => $userId
        ];
        return $this->field('id', $params) !== false;
    }
}