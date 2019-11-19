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

    /**
     * Fetches the unread notifications
     * of the given user
     * 
     * @param int $userId - users.id
     * @param int page
     * @param int limit
     * @return array - list of Notification object
     */
    public function fetchUnreadNotifications($userId, $page = 1, $limit = 3)
    {
        return $this->find('all', [
            'contain' => ['User'],
            'conditions' => [
                'receiver_id' => $userId,
                'is_read' => null,
            ],
            'order' => 'created DESC',
            'page' => $page,
            'limit' => $limit
        ]);
    }

    /**
     * Counts the unread notifications
     * of the user given
     * 
     * @param int $userId - users.id
     * @return int - the number of unread notifications
     */
    public function countUnreadNotifications($userId)
    {
        return $this->find('count', [
            'conditions' => [
                'receiver_id' => $userId,
                'is_read' => null,
            ],
        ]);
    }

    /**
     * Reads a notification by id
     * @param int $id - notification_id
     * @return bool
     */
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
        $conditions = ['Notification.receiver_id' => $userId];
        $this->unbindModel([
            'belongsTo' => array_keys($this->belongsTo)
        ], true);
        if ( ! $this->updateAll(['is_read' => $field], $conditions)) {
            throw new InternalErrorException(__('Cannot updateAll'));
        }
        return true;
    }

    /**
     * Adds notifcation data to database
     * @param object $data - Notification Object
     * @return bool
     */
    public function addNotification($data)
    {
        $this->set($data);

        if ( ! $this->willNotify($data)) {
            return false;
        }

        if ( ! $this->validates()) {
            // TODO: should throw error?
            // this should be a programmer error
            return false;
        }

        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        return true;
    }

    /** 
     * Checks if system will notify user
     * used to negate spamming
     * 
     * @param object $data - data to be checked
     * @return bool - yes if will notify else no
     */
    public function willNotify($data)
    {
        $checkData = $data;
        $checkData['is_read'] = null;
        if ($this->hasAny($checkData)) {
            // Wont notify if notification already exists
            // that hasn't exists yet
            return false;
        }
        return true;
    }

    /**
     * Used in notifying user using websockets,
     * will send a post data to the http socket of node
     * and sends notification to user through the websocket connection
     */
    public function afterSave($created, $options = [])
    {
        if ( ! $created) return true;
        /** Send to websocket server */
        $userModel = ClassRegistry::init('User');
        $User = $userModel->findById(
            $this->data[$this->alias]['user_id'],
            'username, avatar_url'
        );

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
                'user' => $User['User'],
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