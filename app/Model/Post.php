<?php

class Post extends AppModel
{
    public $actsAs = ['SoftDeletable'];
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
            'conditions' =>['Comments.deleted' => null],
            'order' => 'Comments.created DESC',
            'limit' => 10,
        ],
    ];

    public $belongsTo = [
        'User' => [
            'className' => 'User',
            'fields' => ['username']
        ],
    ];

    public function fetchPostsOfUser($userId, $pageNo = 1, $perPage = 5)
    {
        $offset = ($pageNo - 1) * $perPage;
        $procedure = "CALL fetchPostsOfUser($userId, $perPage, $offset)";
        $data = $this->query($procedure);
        foreach ($data as $key => $item) {
            $data[$key]['Post']['likes'] = $this->getLikes($item['Post']['id']);
        }
        return $data;
    }

    public function fetchPostsToDisplay($userId, $pageNo = 1, $perPage = 5)
    {
        $offset = ($pageNo - 1) * $perPage;
        $procedure = "CALL fetchPostsToDisplay($userId, $perPage, $offset)";
        $data = $this->query($procedure);
        foreach ($data as $key => $item) {
            $data[$key]['Post']['likes'] = $this->getLikes($item['Post']['id']);
        }
        return $data;
    }

    public function fetchPostsWithComments($postId)
    {
        $post = $this->findById($postId);
        if ( ! $post) {
            throw new NotFoundException(__('Invalid post'));
        }
        // foreach ($post['Likes'] as $key => $like) {
        //     $post['Post']['likes'][] = $like['user_id'];
        //     $post['Likes'][$key]['username'] = $this->User->field(
        //         'username',
        //         ['User.id' => $like['user_id']]
        //     );
        // }
        $post['Post']['likes'] = array_map(function ($like) {
            return $like['user_id'];
        }, $post['Likes']);
        foreach ($post['Comments'] as $key => $comment) {
            $post['Comments'][$key]['username'] = $this->User->field(
                'username',
                ['User.id' => $comment['user_id']]
            );
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
        return true;
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