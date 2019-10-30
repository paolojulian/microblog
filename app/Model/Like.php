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
            'fields' => 'username'
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
        $Notification = ClassRegistry::init('Notification');
        $Post = ClassRegistry::init('Post');
        if (!!$likeId) {
            $this->id = $likeId;
            if ( ! $this->delete()) {
                throw new InternalErrorException();
            }
        } else {
            if ( ! $this->save()) {
                throw new InternalErrorException();
            }
            $receiver_id = $Post->field('user_id', ['id' => $data['post_id']]);
            $Notification->addNotification([
                'receiver_id' => $receiver_id,
                'user_id' => $userId,
                'message' => 'Someone has liked your post'
            ]);
        }
        return true;
    }

    public function afterSave($created, $options = [])
    {
        if ( ! $created) return true;
        $notificationModel = ClassRegistry::init('Notification');
        $notificationModel->set([
            'message' => 'Someone liked your post',
            'receiver_id' => $this->data[$this->alias]['user_id']
        ]);
        return true;
    }
}