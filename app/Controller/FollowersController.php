<?php

class FollowersController extends AppController
{
    public $components = ['RequestHandler'];

    /**
     * Fetches all followers
     */
    public function index()
    {
        $followers = $this->Follower->find('all', [
            'contain' => ['User'],
            'fields' => [
                'user_id',
                'User.username',
                'User.first_name',
                'User.last_name',
                'User.email'
            ],
            'conditions' => ['following_id' => $this->request->user->id]
        ]);
        return $this->responseData($followers);
    }

    public function follow($userId = null)
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $followerEntity = $this->Follower->find('first', [
            'recursive' => true,
            'fields' => ['id'],
            'conditions' => [
                'following_id' => $userId,
                'user_id' => $this->request->user->id
            ]
        ]);
        if ( ! $followerEntity) {
            $data = [
                'user_id' => $this->request->user->id,
                'following_id' => $userId
            ];
            $this->Follower->set($data);
            if ( ! $this->Follower->validates()) {
                return $this->responseUnprocessableEntity('', $this->Follower->validationErrors);
            }

            if ( ! $this->Follower->save($data)) {
                throw new InternalErrorException();
            }
        } else {
            if ( ! $this->Follower->delete($followerEntity['Follower']['id'])) {
                throw new InternalErrorException();
            }
        }

        return $this->responseOK();
    }

    public function isAuthorized($user)
    {
        switch ($this->action) {
            case 'index':
                // No break
            case 'follow':
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