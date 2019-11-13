<?php

class NotificationsController extends AppController
{
    public $components = ['RequestHandler'];

    public function beforeFilter()
    {
        parent::beforeFilter();
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * 
     * Gets the unread notifications 
     * of the current user
     * 
     * @return json
     */
    public function unread()
    {
        $this->request->allowMethod('get');
        if ( ! $page = $this->request->query('page')) {
            $page = 1;
        }
        return $this->responseData(
            $this->Notification->fetchUnreadNotifications(
                $this->request->user->id,
                $page
            )
        );
    }


    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * 
     * Counts the unread notifications 
     * of the current user
     * 
     * @return int - Number of unread notifications
     */
    public function unreadCount()
    {
        $this->request->allowMethod('get');
        return $this->responseData(
            $this->Notification->countUnreadNotifications(
                $this->request->user->id
            )
        );
    }

    /**
     * [ANY]
     * [PRIVATE] - for logged in users only
     * 
     * Sets the notification as read
     * @return json - status(200)
     */
    public function read($id)
    {
        $this->Notification->readNotification($id);
        return $this->responseOk();
    }

    /**
     * [ANY]
     * [PRIVATE] - for logged in users only
     * 
     * sets all notification as read
     * @return json - status(200)
     */
    public function readAll()
    {
        $this->Notification->readAll($this->request->user->id);
        return $this->responseOk();
    }
}