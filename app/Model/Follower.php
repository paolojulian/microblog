<?php

class Follower extends AppModel
{
    public $actsAs = array('Containable');
    public $hasMany = [
        'User' => [
            'className' => 'User',
        ],
    ];

    public $validate = [
        'user_id' => [
            'rule' => 'notBlank',
            'required' => true
        ],
        'following_id' => [
            'rule' => 'notBlank',
            'required' => true
        ]
    ];

    public function countFollowers($userId)
    {
        return $this->find('count', [
            'conditions' => ['following_id' => $userId]
        ]);
    }

    public function countFollowing($userId)
    {
        return $this->find('count', [
            'conditions' => ['user_id' => $userId]
        ]);
    }

    public function isOwnedBy($followerId, $user)
    {
        $params = [
            'following_id' => $followerId,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }

}