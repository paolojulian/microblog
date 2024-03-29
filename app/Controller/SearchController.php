<?php

App::uses('AppController', 'Controller');

class SearchController extends AppController
{
    public $components = ['RequestHandler'];

    /** Public routes */
    public $public = ['index', 'users', 'posts'];

    public function beforeFilter()
    {
        parent::beforeFilter();
    }
    
    /**
     * [GET]
     * [PUBLIC]
     * 
     * Searches for posts and users according
     * to the text given
     * 
     * @param string - string to match
     * @return object - object with array of users and posts
     */
    public function index($searchText)
    {
        $this->request->allowMethod('get');
        $this->loadModel('User');
        $this->loadModel('Post');
        $userId = null;
        if (isset($this->request->user->id) && ! empty($this->request->user->id)) {
            // Wont add currently logged-in user in search
            // if user is logged in
            $userId = $this->request->user->id;
        }
        $users = $this->User->searchUser(
            $searchText,
            $userId
        );
        $posts = $this->Post->searchPost($searchText);
        return $this->responseData([
            'users' => $users,
            'posts' => $posts
        ]);
    }

    /**
     * [GET]
     * [PUBLIC]
     * 
     * Searches users accoring to searchtext passed
     * and page no.
     * 
     * @param string $searchText
     * @return array - array of users
     */
    public function users($searchText)
    {
        $this->request->allowMethod('get');
        $page = $this->request->query('page');
        $userId = null;
        if (isset($this->request->user->id) && ! empty($this->request->user->id)) {
            // Wont add currently logged-in user in search
            // if user is logged in
            $userId = $this->request->user->id;
        }
        $this->loadModel('User');
        $data = $this->User->searchUser(
            $searchText,
            $userId,
            $page
        );
        return $this->responseData($data);
    }

    /**
     * [GET]
     * [PUBLIC]
     * 
     * Searches posts accoring to searchtext passed
     * and page no.
     * 
     * @param string $searchText
     * @return array - array of posts
     */
    public function posts($searchText)
    {
        $this->request->allowMethod('get');
        $page = $this->request->query('page');
        $this->loadModel('Post');
        $data = $this->Post->searchPost(
            $searchText,
            $page
        );
        return $this->responseData($data);
    }
}