<?php

App::uses('AppController', 'Controller');

class ProfilesController extends AppController
{
    public $components = [
        'RequestHandler',
        'UserHandler'
    ];

    public function beforeFilter()
    {
        parent::beforeFilter();
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * 
     * Gets the profile of user by username
     * along with followers and following
     * and if username given is currently being
     * followed by the logged in user
     * 
     * @param string $username - username to search
     * @return json - User object
     */
    public function view($username)
    {
        $this->request->allowMethod('get');
        $this->loadModel('Follower');
        $this->loadModel('User');
        $user = $this->User->findByUsername(
            $username,
            'id, username, first_name, last_name, email, birthdate, sex, avatar_url'
        );
        if ( ! $user) {
            throw new NotFoundException(__('User not found'));
        }
        return $this->responseData([
            'user' => $user["User"],
            'isFollowing' => $this->Follower->isFollowing(
                $this->request->user->id,
                $user['User']['id']
            ),
            'totalFollowers' => $this->Follower->countFollowers($user['User']['id']),
            'totalFollowing' => $this->Follower->countFollowing($user['User']['id']),
        ]);
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * 
     * Gets the current profile of user
     * along with its followers and following
     * 
     * @return json
     */
    public function current()
    {
        $this->request->allowMethod('get');
        $this->loadModel('Follower');
        $this->loadModel('User');
        $user = $this->User->findById(
            $this->request->user->id, 
            'id, username, first_name, last_name, email, birthdate, sex, avatar_url'
        );
        return $this->responseData([
            'user' => $user["User"],
            'isFollowing' => $this->Follower->isFollowing(
                $this->request->user->id,
                $user['User']['id']
            ),
            'totalFollowers' => $this->Follower->countFollowers($this->request->user->id),
            'totalFollowing' => $this->Follower->countFollowing($this->request->user->id),
        ]);
    }

    /**
     * [POST]
     * [PRIVATE] - for loggedin users only
     * 
     * adds or edits the image of the currently logged in
     * user
     * 
     * @return json - 200 status
     */
    public function uploadimage()
    {
        $this->request->allowMethod('post');
        $this->loadModel('User');
        $user = $this->User->findById($this->request->user->id);
        $fullPath = $this->UserHandler->uploadImage($user['User'], $_FILES['profile_img']);
        $this->User->updateAvatar(
            $this->request->user->id,
            $fullPath
        );
        return $this->responseOk();
    }
}