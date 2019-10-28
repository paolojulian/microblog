<?php

class Like extends AppModel
{
    public $actsAs = ['SoftDeletable', 'Containable'];
    public $belongsTo = [
        'Post' => [
            'className' => 'Post',
        ]
    ];

    public function likePost($data)
    {
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

    public function isOwnedBy($like, $user)
    {
        $params = [
            'following_id' => $followerId,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }

}