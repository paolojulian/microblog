<?php

class Post extends AppModel
{
    public $validate = [
        'user_id' => [
            'rule' => 'notBlank',
            'required' => true
        ]
    ];

    public function fetchPostsOfUser($userId, $pageNo = 1, $perPage = 5)
    {
        $offset = ($pageNo - 1) * $perPage;
        $procedure = "CALL fetchPostsOfUser($userId, $perPage, $offset)";
        return $this->query($procedure);
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

    public function isOwnedBy($post, $user)
    {
        $params = [
            'id' => $post,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }
}