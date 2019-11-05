<?php

App::uses('AppController', 'Controller');

class SearchController extends AppController {
    public $components = ['RequestHandler'];

    public $public = ['search'];

    public function beforeFilter() {
        parent::beforeFilter();
    }
    
    /**
     * [GET]
     * [PUBLIC]
     * 
     * Searches for posts and users according
     * 
     * @param string
     * @return object - object with array of users and posts
     */
    public function index($searchText) {
        $this->request->allowMethod('get');
        $this->loadModel('User');
        $this->loadModel('Post');
        $users = $this->User->searchUser(
            $this->request->user->id,
            $searchText
        );
        $posts = $this->Post->searchPost($searchText);
        return $this->responseData([
            'users' => $users,
            'posts' => $posts
        ]);
    }
}