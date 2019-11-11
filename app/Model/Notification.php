<?php

class Notification extends AppModel
{

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

    public function addNotification($data)
    {
        var_dump();die();
        $this->set($data);
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
        $ch = curl_init('http://127.0.0.1:4567');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        $jsonData = json_encode([
            'id' => $this->data[$this->alias]['id'],
            'receiverId' => $this->data[$this->alias]['receiver_id'],
            'message' => $this->data[$this->alias]['message']
        ]);
        $query = http_build_query(['data' => $jsonData]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);
        return true;
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