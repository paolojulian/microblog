<?php

class Comment extends AppModel
{
    public $actsAs = ['SoftDeletable', 'Containable'];
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

    public $belongsTo = [
        'User' => [
            'className' => 'User',
            'fields' => ['username', 'avatar_url']
        ],
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

        return true;
    }

    public function paginateComment($postId, $page = 1)
    {
        $perPage = 10;
        $conditions = ['post_id' => $postId];
        $totalCount = $this->find('count', ['conditions' => $conditions]);
        $totalLeft = $totalCount - ($perPage * $page);
        $data = $this->find('all', [
            'conditions' => $conditions,
            'order' => 'Comments.created DESC',
            'limit' => $perPage,
            'page' => $page,
        ]);
        foreach ($data as $key => $item) {
            $data[$key]['Comments']['username'] = $data[$key]['User']['username'];
            $data[$key]['Comments']['avatar_url'] = $data[$key]['User']['avatar_url'];
            $data[$key] = $data[$key]['Comments'];
        }
        return [
            'list' => $data,
            'totalCount' => $totalCount,
            'totalLeft' => $totalLeft > 0 ? $totalLeft : 0
        ];
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

    public function afterSave($created, $options = [])
    {
        if ( ! $created) return true;
        $Notification = ClassRegistry::init('Notification');
        $Post = ClassRegistry::init('Post');
        $postId = $this->data[$this->alias]['post_id'];
        $userId = $this->data[$this->alias]['user_id'];
        $receiver_id = $Post->field('user_id', ['id' => $postId]);
        if ($receiver_id != $userId) {
            $Notification->addNotification([
                'type' => 'commented',
                'receiver_id' => $receiver_id,
                'user_id' => $userId,
                'post_id' => $postId
            ]);
        }
        return true;
    }
}