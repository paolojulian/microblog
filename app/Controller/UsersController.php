<?php

App::uses('AppController', 'Controller');
App::uses('Security', 'Utility');
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');

class UsersController extends AppController {
    public $components = [
        'RequestHandler',
        'UserHandler',
    ];
    public $public = ['register', 'activate', 'login', 'accessDenied'];

    public function beforeFilter() {
        parent::beforeFilter();
    }
    
    /**
     * TODO
     * Don't know if this is used
     */
    public function view($id = null) {
        $this->request->allowMethod('get');
        $this->User->id = $id;
        if ( ! $this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }
        $this->responseData($this->User->findById($id));
    }

    /**
     * [GET] /users/search/:searchText.json
     * [PRIVATE] - only for loggedin user
     * 
     * @return json - array of users
     */
    public function search($searchText)
    {
        $this->request->allowMethod('get');
        $users = $this->User->searchUser(
            $searchText,
            $this->request->user->id,
        );
        return $this->responseData($users);
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

        try {
            $timeStr = str_replace("0.", "", microtime());
            $timeStr = str_replace(" ", "", $timeStr);
            $this->request->data['activation_key'] = Security::hash('lkkasdjfalj').'_'.$timeStr;
            if ( ! $this->User->addUser($this->request->data)) {
                return $this->responseUnprocessableEntity('', $this->User->validationErrors);
            }
            $this->UserHandler->sendActivationMail($this->request->data);
        } catch (Exception $e) {
            throw new InternalErrorException(__($e->getMessage()));
        }

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

        try {
            if ( ! $this->User->editUser($this->request->user->id, $this->request->data)) {
                return $this->responseUnprocessableEntity('', $this->User->validationErrors);
            }
        } catch (Exception $e) {
            throw new InternalErrorException(__($e->getMessage()));
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

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     */
    public function notfollowed()
    {
        $this->request->allowMethod('get');
        $page = $this->request->query('page');
        if ( ! $page) {
            $page = 1;
        }
        return $this->responseData(
            $this->User->getNotFollowedUsers(
                $this->request->user->id,
                $page
            )
        );
    }

    /**
     * [POST]
     * [PRIVATE] - for logged in users only
     * Logout the user currently logged in
     */
    public function logout()
    {
        $this->request->allowMethod('post');
        $this->Auth->logout();
        return $this->responseOK();
    }

    /**
     * [GET]
     * [PUBLIC]
     * A link is given to a user
     * Activates the user by the its activation key
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
        $this->redirect('/');
    }
}