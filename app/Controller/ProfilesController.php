<?php

App::uses('AppController', 'Controller');

class ProfilesController extends AppController
{
    public $components = ['RequestHandler'];

    public function beforeFilter() {
        parent::beforeFilter();
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * Gets the current profile of user
     * along with its followers and following
     */
    public function current()
    {
        $this->request->allowMethod('get');
        $this->loadModel('Follower');
        $user = $this->request->user;
        return $this->responseData([
            'user' => $user,
            'totalFollowers' => $this->Follower->countFollowers($user->id),
            'totalFollowing' => $this->Follower->countFollowing($user->id),
        ]);
    }
}