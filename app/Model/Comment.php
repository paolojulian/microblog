<?php

class Comment extends AppModel
{
    public $validate = [
        'user_id' => [
            'rule' => 'notBlank',
            'required' => true
        ],
        'post_id' => [
            'rule' => 'notBlank',
            'required' => true
        ],
        'body' => [
            'notBlank' => [
                'rule' => 'notBlank',
                'required' => true,
                'message' => 'Please enter your comment.'
            ],
            'maxLength' => [
                'rule' => ['maxLength', 140],
                'required' => true,
                'message' => 'Up to 140 characters is allowed'
            ]
        ]
    ];

    public function isOwnedBy($comment, $user) {
        $params = [
            'id' => $comment,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }
}