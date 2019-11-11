<?php

App::uses('AppController', 'Controller');

class AuthsController extends AppController
{
    public $components = [
        'RequestHandler',
        'UserHandler',
        'HasherHandler'
    ];

    /** Public routes */
    public $public = ['view', 'register', 'activate', 'login', 'accessDenied'];

    public function beforeFilter()
    {
        parent::beforeFilter();
    }
    
    /**
     * TODO
     * Don't know if this is used
     */
    public function view($id = null)
    {
        die('test');
    }

    /**
     * [GET]
     * [PUBLIC]
     * 
     * A link is given to a user upon successful registration
     * 
     * Activates the user by the its activation key
     * 
     * @return void
     */
    public function activate($key)
    {
        $user = $this->User->findByActivationKey($key);
        if ( ! $user) {
            die('Account was not found');
        }
        if ( ! $user['User']['is_activated']) {
            $this->User->activateUser($user['User']['id']);
        }
        echo 'User activated';
        return $this->redirect('/');
    }
}