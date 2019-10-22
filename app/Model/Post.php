<?php

class Post extends AppModel
{
    public $validate = [
        'user_id' => [
            'rule' => 'notBlank',
            'required' => true
        ]
    ];

    public function isOwnedBy($post, $user) {
        $params = [
            'id' => $post,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }
}