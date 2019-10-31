<?php

class Notification extends AppModel
{
    public $actsAs = ['SoftDeletable'];
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

    public function addNotification($data)
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

    public function afterSave($created, $options = [])
    {
        if ( ! $created) return true;
        /** Send to websocket server */
        $ch = curl_init('http://127.0.0.1:8080');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        $jsonData = json_encode([
            'id' => $this->data[$this->alias]['receiver_id'],
            'message' => $this->data[$this->alias]['message']
        ]);
        $query = http_build_query(['data' => $jsonData]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        debug(curl_error($ch));
        curl_close($ch);
        return true;
    }
}