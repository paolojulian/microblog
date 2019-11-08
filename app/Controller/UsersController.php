<?php

App::uses('AppController', 'Controller');
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');

class UsersController extends AppController
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
        die();
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
    public function register()
    {
        $this->request->allowMethod('post');
        $this->request->data['activation_key'] = $this->HasherHandler->generateRand();
        if ( ! $this->User->addUser($this->request->data)) {
            return $this->responseUnprocessableEntity('', $this->User->validationErrors);
        }

        try {
            // TODO add a page if mail failed,
            // should display resend link
            $this->UserHandler->sendActivationMail($this->request->data);
        } catch (Exception $e) {
            throw new InternalErrorException(__($e->getMessage()));
        }

        return $this->responseOK();
    }

    /**
     * [PUT]
     * [PRIVATE] - logged in users only
     * 
     * Edits current user
     * 
     * @return json
     */
    public function edit()
    {
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
     * 
     * @return json
     */
    public function delete($id = null)
    {
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

        return $this->responseData($this->jwtEncode($user["User"]));
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * 
     * Checks the mutual friends of a certain friend
     * and currently logged in user
     * 
     * @param username - user to be checked
     * @return json - array of Users
     */
    public function mutual($username)
    {
        $this->request->allowMethod('get');
        $friendUser = $this->User->findByUsername($username, 'id');
        return $this->responseData(
            $this->User->getMutualFriends(
                $this->request->user->id,
                $friendUser['User']['id']
            )
        );
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * 
     * Fetches not yet followed users
     * Prioritizes friends of friends with mutual connections
     * and then previously created users
     * 
     * TODO
     * for improvement should add location of user
     * and prioritize same locations
     * 
     * @return json - array of Users
     */
    public function notfollowed()
    {
        $this->request->allowMethod('get');
        $page = $this->request->query('page');
        if ( ! $page) {
            $page = 1;
        }
        return $this->responseData(
            $this->User->getFriendsOfFriends(
                $this->request->user->id,
                $page
            )
        );
    }

    /**
     * [POST]
     * [PRIVATE] - for logged in users only
     * 
     * Logouts the user currently logged in
     * 
     * TODO
     * this is unnecessary because the system is now
     * using JWT token
     * 
     * @return json
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