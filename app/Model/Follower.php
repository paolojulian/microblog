<?php

class Follower extends AppModel
{
    public $actsAs = array('Containable');
    public $belongsTo = [
        'User' => [
            'className' => 'User',
            'foreignkey' => 'id'
        ],
        'Following' => [
            'className' => 'User',
            'foreignkey' => 'id'
        ]
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

    public function isOwnedBy($followerId, $user)
    {
        $params = [
            'following_id' => $followerId,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }

}