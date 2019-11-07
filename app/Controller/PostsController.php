<?php

class PostsController extends AppController
{
    public $components = [
        'RequestHandler',
        'PostHandler'
    ];

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
        $page = $this->request->query('page');
        return $this->responseData(
            // TODO Change to posts to display
            $this->Post->fetchPostsToDisplay($this->request->user->id, $page)
        );
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in user only
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
     * [PRIVATE] - only for logged in user
     * 
     * Checks the posts created or shared by the user
     * 
     * @param int $username - users.username (UNIQUE)
     * @return json
     */
    public function user($username)
    {
        $this->request->allowMethod('get');
        $page = $this->request->query('page');
        $this->loadModel('User');
        $user = $this->User->findByUsername($username, 'id');
        return $this->responseData(
            // TODO Change to posts to display
            $this->Post->fetchPostsOfUser(
                $user['User']['id'],
                $page
            )
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
        if (isset($_FILES['img']) && !!$_FILES['img']) {
            $this->request->data['img_path'] = $this->PostHandler->uploadImage(
                $_FILES['img'],
                $this->request->user->id,
                $this->request->data
            );
        }
        if ( ! $this->Post->addPost($this->request->data)) {
            return $this->responseUnprocessableEntity('', $this->Post->validationErrors);
        }

        return $this->responseCreated($this->Post);
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
        $this->request->allowMethod('post');
        $this->request->data['user_id'] = $this->request->user->id;
        if (isset($_FILES['img']) && !!$_FILES['img']) {
            $this->request->data['img_path'] = $this->PostHandler->uploadImage(
                $_FILES['img'],
                $this->request->user->id,
                $this->request->data
            );
        }
        if ( ! $this->Post->editPost($id, $this->request->data)) {
            return $this->responseUnprocessableEntity('', $this->Post->validationErrors);
        }
        return $this->responseOk();
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
        if ( ! $this->Post->Likes->likePost($id, $this->request->user->id)) {
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
     * [GET]
     * [PRIVATE] - only for logged in user
     * 
     * Fetches likes by post
     * 
     * @param int $id - PK posts table
     * @return json
     */
    public function likes($id)
    {
        $this->request->allowMethod('get');
        $page = $this->request->query('page');
        return $this->responseData(
            $this->Post->Likes->paginateLikes(
                $this->request->user->id,
                $id,
                $page
            )
        );
    }

    /**
     * [GET]
     * [PRIVATE] - only for logged in user
     * 
     * Fetches comments by post
     * 
     * @param int $id - PK posts table
     * @return json
     */
    public function comments($id)
    {
        $this->request->allowMethod('get');
        $page = $this->request->query('page');
        return $this->responseData(
            $this->Post->Comments->paginateComment($id, $page)
        );
    }

    /**
     * [DELETE]
     * [PRIVATE] - can only delete own posts
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