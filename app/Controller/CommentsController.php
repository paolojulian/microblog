<?php

class CommentsController extends AppController
{
    public $components = ['RequestHandler'];

    public function index()
    {
    }

    public function view($id = null)
    {
        if ( ! $id) {
            throw new NotFoundException(__('Invalid Comment'));
        }

        $comment = $this->Comment->findById($id);
        if ( ! $comment) {
            throw new NotFoundException(__('Invalid Comment'));
        }

        return $this->responseData($comment);
    }

    public function add()
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $data = $this->request->data;
        $data['user_id'] = $this->Auth->user('id');
        $this->Comment->set($data);
        if ( ! $this->Comment->validates()) {
            return $this->responseUnprocessableEntity('', $this->Comment->validationErrors);
        }

        if ( ! $this->Comment->save()) {
            throw new InternalErrorException();
        }

        return $this->responseOK();
    }

    public function edit($id = null)
    {
        if ( ! $this->request->is('put')) {
            throw new MethodNotAllowedException();
        }

        if ( ! $id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $comment = $this->Comment->findById($id);
        if ( ! $comment) {
            throw new NotFoundException(__('Invalid post'));
        }

        $this->Comment->id = $id;
        if ( ! $this->Comment->save($this->request->data)) {
            throw new InternalErrorException();
        }

        return $this->responseOk();
    }

    public function delete($id = null)
    {
        if ( ! $this->request->is('delete')) {
            throw new MethodNotAllowedException();
        }

        if ( ! $id) {
            throw new NotFoundException(__('Invalid post'));
        }

        if ( ! $this->Comment->delete($id)) {
            throw new InternalErrorException();
        }

        return $this->responseDeleted();
    }

    public function isAuthorized($user)
    {
        switch ($this->action) {
            case 'add':
                if ($this->Auth->user()) {
                    return true;
                }
                break;
            case 'edit':
                // No break
            case 'delete':
                $commentId = (int) $this->request->params['pass'][0];
                if ($this->Comment->isOwnedBy($commentId, $user['id'])) {
                    return true;
                }
                break;
            default:
                break;
        }
        return parent::isAuthorized($user);
    }
}