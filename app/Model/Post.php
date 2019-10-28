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
            'rule' => 'notBlank',
            'message' => 'Please enter your message',
            'required' => true
        ],
    ];

    public $hasMany = [
        'Likes' => [
            'className' => 'Like',
            'fields' => ['user_id'],
            'conditions' =>['Likes.deleted' => null]
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
            $data[$key]['likes'] = $this->getLikes($item['post']['id']);
        }
        return $data;
    }

    public function getLikes($postId)
    {
        return array_values($this->Likes->find('list', [
            'fields' => ['user_id'],
            'conditions' => ['post_id' => $postId]
        ]));
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
        $post = $this->Post->findById($postId);
        if ( ! $post) {
            throw new NotFoundException(__('Invalid post'));
        }
        $commentModel = ClassRegistry::init('Comment');
        $post['Post']['comments'] = $commentModel->find('all', [
            'conditions' => ['post_id' => $postId],
            'order' => ['modified' => 'desc']
        ]);
        return $post;
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
        $this->set([
            'retweet_post_id' => $postId,
            'user_id' => $userId
        ]);
        $post = $this->findById($postId);
        if ( ! $post) {
            throw new NotFoundException();
        }
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