<?php

class FollowersController extends AppController
{
    public $components = ['RequestHandler'];

    public function beforeFilter() {
        parent::beforeFilter();
    }

    /**
     * Fetches all followers
     */
    public function index()
    {
        $this->request->allowMethod('get');
        try {
            switch ($this->request->query('type')) {
                case 'follower':
                    $followers = $this->Follower->fetchFollowersOfUser(
                        $this->request->query('userId'),
                        $this->request->query('page'),
                        $this->request->user->id
                    );
                    break;
                case 'following':
                    $followers = $this->Follower->fetchFollowedByUser(
                        $this->request->query('userId'),
                        $this->request->query('page'),
                        $this->request->user->id
                    );
                    break;
                default:
                    throw new BadRequestException(__('Invalid Type Given'));
                    break;
            }
            return $this->responseData($followers);
        } catch (Exception $e) {
            throw new InternalErrorException(__($e->getMessage()));
        }
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
}