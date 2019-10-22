<?php

class Like extends AppModel
{
    public $actsAs = ['Containable'];
    public $belongsTo = [
        'User' => [
            'className' => 'User',
            'foreignkey' => 'id'
        ],
        'Post' => [
            'className' => 'Post',
            'foreignkey' => 'id'
        ]
    ];

    public $validate = [
        'post_id' => [
            'notBlank' => [
                'rule' => 'notBlank',
                'required' => true
            ],
            'isUnique' => [
                'rule' => ['isUnique', ['user_id'], false]
            ]
        ],
        'user_id' => [
            'notBlank' => [
                'rule' => 'notBlank',
                'required' => true
            ],
            'isUnique' => [
                'rule' => ['isUnique', ['post_id'], false]
            ]
        ]
    ];

    public function isOwnedBy($like, $user)
    {
        $params = [
            'following_id' => $followerId,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }

}