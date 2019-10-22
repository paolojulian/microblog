<?php

class PostsController extends AppController
{
    public $components = ['RequestHandler'];

    public function index()
    {
        $this->loadModel('Follower');
        $followedUsers = $this->Follower->find('list', [
            'recursive' => 0,
            'fields' => ['following_id'],
            'conditions' => ['user_id' => $this->Auth->user('id')]
        ]);
        $followedUsers[] = $this->Auth->user('id');
        $posts = $this->Post->find('all', [
            'fields' => ['title', 'body', 'id', 'user_id'],
            'order' => ['created' => 'desc'],
            'conditions' => ['user_id' => $followedUsers],
            'limit' => 5,
        ]);

        return $this->responseData($posts);
    }

    public function view($id = null)
    {
        if ( ! $id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException(__('Invalid post'));
        }

        $this->loadModel('Comment');
        $post['Post']['comments'] = $this->Comment->find('all', [
            'order' => ['modified' => 'desc']
        ]);

        return $this->responseData($post);
    }

    public function add()
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $this->request->data['user_id'] = $this->Auth->user('id');
        $this->Post->set($this->request->data);
        if ( ! $this->Post->validates()) {
            return $this->responseUnprocessableEntity('', $this->Post->validationErrors);
        }

        if ( ! $this->Post->save($this->request->data)) {
            return $this->responseInternalServerError();
        }

        return $this->responseCreated();
    }

    public function share($id)
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $post = $this->Post->findById($id);
        if ( ! $post) {
            throw new NotFoundException();
        }

        $this->Post->set([
            'retweet_from' => $id,
            'user_id' => $this->Auth->user('id')
        ]);
        if ( ! $this->Post->save($this->request->data)) {
            return $this->responseInternalServerError();
        }

        return $this->responseCreated();
    }

    public function edit($id = null)
    {
        if ( ! $this->request->is('put')) {
            throw new MethodNotAllowedException();
        }
        if ( ! $id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $this->request->data['user_id'] = $this->Auth->user('id');
        $this->Post->set($this->request->data);
        if ( ! $this->Post->validates()) {
            return $this->responseUnprocessableEntity('', $this->Post->validationErrors);
        }

        $this->Post->id = $id;
        if ( ! $this->Post->save($this->request->data)) {
            throw new InternalErrorException();
        }

        return $this->responseOk();
    }

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
        if (in_array($this->action, ['share', 'add'])) {
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