<?php

class Like extends AppModel
{
    public $actsAs = ['SoftDeletable', 'Containable'];
    public $belongsTo = [
        'Post' => [
            'className' => 'Post',
        ],
        'User' => [
            'className' => 'User',
            'fields' => ['id', 'username', 'first_name', 'last_name', 'avatar_url']
        ]
    ];

    public function likePost($postId, $userId)
    {
        $data = [
            'post_id' => $postId,
            'user_id' => $userId
        ];
        $this->set($data);
        $likeId = $this->field('id', $data);
        if (!!$likeId) {
            $this->id = $likeId;
            if ( ! $this->delete()) {
                throw new InternalErrorException();
            }
        } else {
            if ( ! $this->save()) {
                throw new InternalErrorException();
            }
        }
        return true;
    }

    public function paginateLikes($userId, $postId, $page = 1)
    {
        $perPage = 20;
        $data = $this->find('all', [
            'contain' => ['User'],
            'conditions' => ['post_id' => $postId],
            'order' => 'Likes.created DESC',
            'limit' => $perPage,
            'page' => $page,
        ]);
        $followerModel = ClassRegistry::init('Follower');
        foreach ($data as $key => $item) {
            $data[$key]['User']['is_following'] = true;
            $item = $item['User'];
            if ($userId != $item['id']) {
                $data[$key]['User']['is_following'] = $followerModel->isFollowing($userId, $item['id']);
            }
        }
        return $data;
    }

    public function afterSave($created, $options = [])
    {
        if ( ! $created) return true;
        $notificationModel = ClassRegistry::init('Notification');
        $Post = ClassRegistry::init('Post');
        $postId = $this->data[$this->alias]['post_id'];
        $userId = $this->data[$this->alias]['user_id'];
        $receiverId = $Post->field('user_id', ['id' => $postId]);
        if ($receiverId != $userId) {
            $notificationData = [
                'type' => 'liked',
                'receiver_id' => $receiverId,
                'post_id' => $postId,
                'user_id' => $userId,
            ];
            $notificationModel->addNotification($notificationData);
        }
        return true;
    }
}