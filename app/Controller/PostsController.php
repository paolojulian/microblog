<?php

class PostsController extends AppController
{
    public $components = ['RequestHandler'];

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * Fetch posts to display
     * Fetches
     *  : Own Post
     *  : Followed Post
     *  : Shared Post
     *  Ordered by created DESC
     */
    public function index()
    {
        return $this->responseData(
            $this->Post->fetchPostsOfUser($this->Auth->user('id'))
        );
    }

    /**
     * [GET]
     * [PUBLIC]
     * 
     * Fetches a post along with its comments
     * 
     * @param int $id - PK tbl posts
     * @return json
    */
    public function view($id)
    {
        return $this->responseData(
            $this->Post->fetchPostsWithComments($id)
        );
    }

    /**
     * [POST]
     * [PRIVATE] - only for logged in user
     * 
     * Creates a post
     * 
     * @return json
     */
    public function add()
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $this->request->data['user_id'] = $this->Auth->user('id');
        if ( ! $this->Post->addPost($this->request->data)) {
            return $this->responseUnprocessableEntity('', $this->Post->validationErrors);
        }

        return $this->responseCreated();
    }

    /**
     * [POST]
     * [PRIVATE] - only for logged in user
     * 
     * Shares a post
     * 
     * @param int $id - PK posts table
     * @return json
     */
    public function share($id)
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $this->Post->sharePost($id, $this->Auth->user('id'));
        return $this->responseCreated();
    }

    /**
     * [PUT]
     * [PRIVATE] - can only edit own posts
     * 
     * Edits the title and body of a post
     * 
     * @return json
     */
    public function edit($id)
    {
        if ( ! $this->request->is('put')) {
            throw new MethodNotAllowedException();
        }

        $this->request->data['user_id'] = $this->Auth->user('id');
        if ( ! $this->Post->editPost($id, $this->request->data)) {
            return $this->responseUnprocessableEntity('', $this->Post->validationErrors);
        }
        return $this->responseOk();
    }

    /**
     * [DELETE]
     * [PRIVATE] - can only delete self posts
     * 
     * Deletes a post or a shared post
     * 
     * @return json
     */
    public function delete($id)
    {
        if ( ! $this->request->is('delete')) {
            throw new MethodNotAllowedException();
        }

        if ( ! $this->Post->delete($id)) {
            throw new InternalErrorException();
        }

        return $this->responseDeleted();
    }

    public function isAuthorized($user)
    {
        if (in_array($this->action, ['share', 'add', 'index'])) {
            if ($user) {
                return true;
            }
        }
        if (in_array($this->action, ['edit', 'delete'])) {
            $postId = (int) $this->request->params['pass'][0];
            if ($this->Post->isOwnedBy($postId, $user['id'])) {
                return true;
            }
        }
        return parent::isAuthorized($user);
    }
}