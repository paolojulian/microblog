<?php

class LikesController extends AppController
{
    public $components = ['RequestHandler'];

    public function beforeFilter() {
        parent::beforeFilter();
    }

    public function like($postId = null)
    {
        $this->request->allowMethod('post');
        $this->Like->likePost($postId, $this->request->user->id);
        return $this->responseOK();
    }

    public function unlike($postId = null)
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        if ( ! $postId) {
            throw new NotFoundException(__('Id cannot be null'));
        }

        $likeEntity = $this->Like->find('first', [
            'fields' => ['id'],
            'conditions' => [
                'post_id' => $postId,
                'user_id' => $this->Auth->user('id')
            ]
        ]);

        if ($likeEntity) {
            if ( ! $this->Like->delete($likeEntity['Like']['id'])) {
                throw new InternalErrorException();
            }
        }

        return $this->responseOK();
    }
}