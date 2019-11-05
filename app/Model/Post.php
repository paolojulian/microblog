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
            'rule' => 'notBlank',
            'message' => 'Please enter a title for your post',
            'required' => true
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
            'limit' => 10,
            'conditions' =>['Comments.deleted' => null],
        ],
    ];

    public $belongsTo = [
        'User' => [
            'className' => 'User',
            'fields' => ['username', 'avatar_url']
        ],
    ];

    public function fetchPostsOfUser($userId, $pageNo = 1, $perPage = 5)
    {
        $offset = ($pageNo - 1) * $perPage;
        $procedure = "CALL fetchPostsOfUser($userId, $perPage, $offset)";
        $data = $this->query($procedure);
        $this->getLikesAndComments($data);
        return $data;
    }

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
                'contain' => ['User.username'],
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
        if ( ! $this->validates()) {
            return false;
        }
        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        return true;
    }

    public function sharePost($postId, $userId)
    {
        $post = $this->hasAny(['id' => $postId]);
        if ( ! $post) {
            throw new NotFoundException();
        }
        $this->validator()->remove('title');
        $this->validator()->remove('body');
        $this->set([
            'retweet_post_id' => $postId,
            'user_id' => $userId
        ]);
        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        $Notification = ClassRegistry::init('Notification');
        $User = ClassRegistry::init('User');
        $username = $User->field('username', ['id' => $userId]);
        $receiver_id = $this->field('user_id', ['id' => $postId]);
        $postId = $postId;
        if ($receiver_id != $userId) {
            $Notification->addNotification([
                'receiver_id' => $receiver_id,
                'user_id' => $userId,
                'message' => "
                    <span class='username'>
                        <a href='/profiles/$username'>
                        @$username
                        </a>
                    </span>
                    has shared your 
                    <a class='text-link' href='/posts/$postId'>post</a>
                "
            ]);
        }
        return true;
    }

    /**
     * TODO
     * For a better searching of user, display users with mutual
     * followers first
     * 
     * @param int $userId - user logged in shouldnt be included in the search
     * @param string $searchText - text to be searched
     */
    public function searchPost($searchText, $page = 1)
    {
        $perPage = 5;
        $searchText = trim($searchText);
        return $this->find('all', [
            'contain' => ['User'],
            'conditions' => [
                'OR' => [
                    'title LIKE' => "%$searchText%",
                    'body LIKE' => "%$searchText%",
                ],
            ],
            'order' => 'Post.created DESC',
            'limit' => $perPage,
            'page' => $page
        ]);
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