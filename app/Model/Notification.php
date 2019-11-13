<?php

class Notification extends AppModel
{

    const TYPES = ['commented', 'liked', 'followed', 'shared'];

    public $belongsTo = [
        'User' => [
            'className' => 'User',
            'fields' => ['username', 'avatar_url']
        ],
    ];

    public $validate = [
        'user_id' => [
            'rule' => 'notBlank',
            'required' => true
        ],
        'receiver_id' => [
            'rule' => 'notBlank',
            'required' => true
        ],
        'type' => [
            'Invalid Type' => [
                'rule' => ['inList', self::TYPES],
                'required' => true
            ]
        ],
    ];

    public function fetchUnreadNotifications($userId, $page = 1)
    {
        $perPage = 3;
        return $this->find('all', [
            'contain' => ['User'],
            'conditions' => [
                'receiver_id' => $userId,
                'is_read' => null,
            ],
            'order' => 'created DESC',
            'page' => $page,
            'limit' => $perPage
        ]);
    }

    public function countUnreadNotifications($userId)
    {
        return $this->find('count', [
            'conditions' => [
                'receiver_id' => $userId,
                'is_read' => null,
            ],
        ]);
    }

    public function readNotification($id)
    {
        $this->id = $id;
        if ( ! $this->saveField('is_read', date('Y-m-d H:i:s'))) {
            throw new InternalErrorException();
        }
        return true;
    }

    /**
     * Sets all notification for a user as 'read'
     * 
     * @param int $userId - user logged in
     * @return void
     */
    public function readAll($userId)
    {
        $db = $this->getDataSource();
        $field = $db->value(date('Y-m-d H:i:s'), 'datetime');
        $conditions = ['user_id' => $userId];
        $this->unbindModel([
            'belongsTo' => array_keys($this->belongsTo)
        ], true);
        if ( ! $this->updateAll(['is_read' => $field], $conditions)) {
            throw new InternalErrorException(__('Cannot updateAll'));
        }
        return true;
    }

    public function addNotification($data)
    {
        $this->set($data);
        // Wont notify if notification already exists
        $checkData = $data;
        $checkData['is_read'] = null;
        if ($this->hasAny($checkData)) {
            return false;
        }
        if ( ! $this->validates()) {
            return false;
        }
        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        return true;
    }

    public function afterSave($created, $options = [])
    {
        if ( ! $created) return true;
        /** Send to websocket server */

        try {
            $ch = curl_init('http://127.0.0.1:4567');
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            $postId = isset($this->data[$this->alias]['post_id'])
                ? $this->data[$this->alias]['post_id']
                : null;
            $jsonData = json_encode([
                'id' => $this->data[$this->alias]['id'],
                'receiverId' => $this->data[$this->alias]['receiver_id'],
                'userId' => $this->data[$this->alias]['user_id'],
                'postId' => $postId,
                'type' => $this->data[$this->alias]['type'],
            ]);
            $query = http_build_query(['data' => $jsonData]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_VERBOSE, true);
            // curl_setopt($ch, CURLOPT_STDERR, '/tmp/logs/curl.log');
            $result = curl_exec($ch);
            if (curl_error ($ch)) {
                echo curl_error ($ch);
            }
            curl_close($ch);
            return true;
        } catch (Exception $e) {
            var_dump($e->getMessage());
        }
    }

    public function isOwnedBy($notificationId, $userId)
    {
        $params = [
            'id' => $notificationId,
            'receiver_id' => $userId
        ];
        return $this->field('id', $params) !== false;
    }
}