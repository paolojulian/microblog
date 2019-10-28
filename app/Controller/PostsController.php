<?php

class PostsController extends AppController
{
    public $components = ['RequestHandler'];
    public $public = ['view', 'user'];

    public function beforeFilter() {
        parent::beforeFilter();
        if (in_array($this->action, ['edit', 'delete'])) {
            parent::isOwnedBy($this->Post, $this->request->user->id);
        }
    }
    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * Fetch posts to display
     * Fetches
     *  : Own Post
     *  : Followed Post
     *  : Shared Post
     *  Ordered by created DESC
     *  Limits by 5
     * 
     * @return json - array of posts
     */
    public function index()
    {
        $this->request->allowMethod('get');
        return $this->responseData(
            // TODO Change to posts to display
            $this->Post->fetchPostsToDisplay($this->request->user->id)
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
        $this->request->allowMethod('get');
        return $this->responseData(
            $this->Post->fetchPostsWithComments($id)
        );
    }

    /**
     * [GET]
     * [PUBLIC]
     * 
     * Checks the posts created or shared by the user
     * 
     * @param int $userId - PK users_tbl
     * @return json
     */
    public function user($userId)
    {
        $this->request->allowMethod('get');
        return $this->responseData(
            // TODO Change to posts to display
            $this->Post->fetchPostsOfUser($this->request->user->id)
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
        $this->request->allowMethod('post');
        $this->request->data['user_id'] = $this->request->user->id;
        if ( ! $this->Post->addPost($this->request->data)) {
            return $this->responseUnprocessableEntity('', $this->Post->validationErrors);
        }

        return $this->responseCreated();
    }

    /**
     * [POST]
     * [PRIVATE] - only for logged in user
     * 
     * Likes a post via the logged_in user
     * 
     * @param int $id - PK posts_tbl
     * @return json
     */
    public function like($id)
    {
        $this->request->allowMethod('post');
        $this->request->data['post_id'] = $id;
        $this->request->data['user_id'] = $this->request->user->id;
        if ( ! $this->Post->Likes->likePost($this->request->data)) {
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
        $this->request->allowMethod('post');
        $this->Post->sharePost($id, $this->request->user->id);
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
        $this->request->allowMethod('put');
        $this->request->data['user_id'] = $this->request->user->id;
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
        $this->request->allowMethod('delete');
        if ( ! $this->Post->delete($id)) {
            throw new InternalErrorException();
        }

        return $this->responseDeleted();
    }
}