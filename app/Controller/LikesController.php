<?php

class LikesController extends AppController
{
    public $components = ['RequestHandler'];

    public function like($postId = null)
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $likeEntity = $this->Like->find('first', [
            'fields' => ['id'],
            'conditions' => [
                'Like.post_id' => $postId,
                'Like.user_id' => $this->Auth->user('id')
            ]
        ]);

        $data = [
            'post_id' => $postId,
            'user_id' => $this->Auth->user('id'),
        ];

        if ( ! $likeEntity) {
            $this->Like->set($data);
            if ( ! $this->Like->validates()) {
                return $this->responseUnprocessableEntity('', $this->Like->validationErrors);
            }

            if ( ! $this->Like->save($data)) {
                throw new InternalErrorException();
            }
        } else {
            if ( ! $this->Like->delete($likeEntity['Like']['id'])) {
                throw new InternalErrorException();
            }
        }

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

    public function isAuthorized($user)
    {
        switch ($this->action) {
            case 'like':
                // No break
            case 'unlike':
                if ($this->Auth->user()) {
                    return true;
                }
                break;
            default:
                break;
        }
        return parent::isAuthorized($user);
    }
}