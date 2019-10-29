<?php

App::uses('AppController', 'Controller');
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');

class UsersController extends AppController {
    public $components = [
        'RequestHandler',
        'UserHandler'
    ];
    public $public = ['register', 'activate', 'login', 'accessDenied'];

    public function beforeFilter() {
        parent::beforeFilter();
    }

    public function index() {
    }

    public function view($id = null) {
        $this->request->allowMethod('get');
        $this->User->id = $id;
        if ( ! $this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }
        $this->responseData($this->User->findById($id));
    }

    /**
     * [POST]
     * [PUBLIC]
     * 
     * Signs up a user,
     * Sends an activation email after a successful registration
     * 
     * @return json
     */
    public function register() {
        $this->request->allowMethod('post');

        $this->request->data['activation_key'] = time();
        if ( ! $this->User->addUser($this->request->data)) {
            return $this->responseUnprocessableEntity('', $this->User->validationErrors);
        }
        $this->UserHandler->sendActivationMail($this->request->data);

        return $this->responseOK();
    }

    /**
     * [PUT]
     * [PRIVATE] - logged in users only
     * Edits current user
     * 
     * @return json
     */
    public function edit() {
        $this->request->allowMethod('put');

        $this->User->id = $this->request->user->id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }

        $this->User->set($this->request->data);
        if ( ! $this->User->validates()) {
            return $this->responseUnprocessableEntity('', $this->User->validationErrors);
        }

        if ( ! $this->User->save($this->request->data)) {
            throw new InternalErrorException();
        }

        return $this->responseOK();
    }

    /**
     * [DELETE]
     * [PRIVATE] - Logged in user only
     */
    public function delete($id = null) {
        $this->request->allowMethod('delete');
        $this->User->id = $id;
        if ( ! $this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }
        if ( ! $this->User->delete()) {
            throw new InternalErrorException(__('Server Error'));
        }

        $this->responseDeleted();
    }

    public function addProfileImage()
    {
        $dir = new Folder(WWW_ROOT . 'img');
    }

    /**
     * [POST]
     * [PUBLIC]
     * 
     * Logs in the current user and returns a Jwt Token upon success
     * Only allow activated accounts
     * 
     * @return json - containing Jwt Token
     */
    public function login()
    {
        $this->request->allowMethod('post');

        $user = $this->User->authenticate($this->request->data);
        if ( ! $user) {
            throw new BadRequestException(__('Invalid Username or Password'));
        }

        if ($user['User']['is_activated'] != 1) {
            throw new BadRequestException(__('Please activate your account first.'));
        }

        $payload = [
            "id" => $user["User"]["id"],
            "first_name" => $user["User"]["first_name"],
            "last_name" => $user["User"]["last_name"],
            "username" => $user["User"]["username"],
            "email" => $user["User"]["email"],
            "birthdate" => $user["User"]["birthdate"],
            "sex" => $user["User"]["sex"],
            "role" => $user["User"]["role"],
        ];
        return $this->responseData($this->jwtEncode($payload));
    }

    public function logout()
    {
        $this->request->allowMethod('post');
        $this->Auth->logout();
        return $this->responseOK();
    }

    /**
     * Activates the user by the its activation key
     */
    public function activate($key)
    {
        $user = $this->User->findByActivationKey($key);
        if ( ! $user) {
            echo 'Account was not found';
            die();
        }
        if ( ! $user['User']['is_activated']) {
            $this->User->activateUser($user['User']['id']);
        }
        echo 'User activated';
        die();
    }
}