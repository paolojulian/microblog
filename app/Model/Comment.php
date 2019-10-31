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

    public function addComment($data)
    {
        $this->set($data);
        if ( ! $this->validates()) {
            return false;
        }
        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        $Notification = ClassRegistry::init('Notification');
        $Post = ClassRegistry::init('Post');
        $User = ClassRegistry::init('User');
        $username = $User->field('username', ['id' => $data['user_id']]);
        $receiver_id = $Post->field('user_id', ['id' => $data['post_id']]);
        $postId = $data['post_id'];
        if ($receiver_id != $data['user_id']) {
            $Notification->addNotification([
                'receiver_id' => $receiver_id,
                'user_id' => $data['user_id'],
                'message' => "@$username has commented on your <a class='text-link' href='/posts/$postId'>post</a>"
            ]);
        }
        return true;
    }
    
    /**
     * Counts the number of comments in a post
     */
    public function countPerPost($postId)
    {
        return $this->find('count', [
            'recursive' => -1,
            'conditions' => ['post_id' => $postId]
        ]);
    }

    public function isOwnedBy($comment, $user)
    {
        $params = [
            'id' => $comment,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }
}