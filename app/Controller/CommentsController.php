<?php

class CommentsController extends AppController
{
    public $components = ['RequestHandler'];

    public function beforeFilter() {
        parent::beforeFilter();
        if (in_array($this->action, ['edit', 'delete'])) {
            parent::isOwnedBy($this->Comment, $this->request->user->id);
        }
    }

    /**
     * [POST] - /comments.json
     * [PRIVATE] - for logged in users only
     * 
     * Adds a comment to a post
     * 
     * @return json
     */
    public function add()
    {
        $this->request->allowMethod('post');
        $data = $this->request->data;
        $data['user_id'] = $this->request->user->id;
        if ( ! $this->Comment->addComment($data)) {
            return $this->responseUnprocessableEntity('', $this->Comment->validationErrors);
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

    /**
     * [DELETE] - /comments/:id.json
     * [PRIVATE] - Can only delete comments owned
     * 
     * Deletes a comment
     * 
     * @return json
     */
    public function delete($id)
    {
        $this->request->allowMethod('delete');

        if ( ! $this->Comment->delete($id)) {
            throw new InternalErrorException();
        }

        return $this->responseDeleted();
    }
}