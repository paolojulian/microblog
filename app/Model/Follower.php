<?php

class Follower extends AppModel
{
    public $actsAs = ['SoftDeletable'];
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

    /**
     * Checks if user follows a certain user
     * @param int $userId
     * @param int $followingId
     */
    public function isFollowing($userId, $followingId)
    {
        return $this->hasAny([
            'user_id' => $userId,
            'following_id' => $followingId
        ]);
    }

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