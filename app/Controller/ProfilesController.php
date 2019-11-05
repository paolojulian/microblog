<?php

App::uses('AppController', 'Controller');
App::uses('ImageResizerHelper', 'PImage');
App::uses('FileUploadHelper', 'PFile');

class ProfilesController extends AppController
{
    public $components = ['RequestHandler'];

    public function beforeFilter() {
        parent::beforeFilter();
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * Gets the profile of user by username
     */
    public function view($username)
    {
        $this->request->allowMethod('get');
        $this->loadModel('Follower');
        $this->loadModel('User');
        $user = $this->User->findByUsername(
            $username,
            'id, username, first_name, last_name, email, birthdate, sex, avatar_url'
        );
        if ( ! $user) {
            throw new NotFoundException(__('User not found'));
        }
        return $this->responseData([
            'user' => $user["User"],
            'isFollowing' => $this->Follower->isFollowing(
                $this->request->user->id,
                $user['User']['id']
            ),
            'totalFollowers' => $this->Follower->countFollowers($user['User']['id']),
            'totalFollowing' => $this->Follower->countFollowing($user['User']['id']),
        ]);
    }

    /**
     * [GET]
     * [PRIVATE] - for logged in users only
     * Gets the current profile of user
     * along with its followers and following
     */
    public function current()
    {
        $this->request->allowMethod('get');
        $this->loadModel('Follower');
        $this->loadModel('User');
        $user = $this->User->findById(
            $this->request->user->id, 
            'id, username, first_name, last_name, email, birthdate, sex, avatar_url'
        );
        return $this->responseData([
            'user' => $user["User"],
            'isFollowing' => $this->Follower->isFollowing(
                $this->request->user->id,
                $user['User']['id']
            ),
            'totalFollowers' => $this->Follower->countFollowers($this->request->user->id),
            'totalFollowing' => $this->Follower->countFollowing($this->request->user->id),
        ]);
    }

    public function uploadimage()
    {
        $this->request->allowMethod('post');
        try {
            $this->loadModel('User');
            $id = $this->request->user->id;
            $user = $this->User->findById($id);
            $username = $user['User']['username'];
            $imageName = $username . time();
            $imgpath = "/img/profiles/$id/";
            $basepath = "/app/webroot$imgpath";
            $fullpath = WWW_ROOT . $imgpath;
            $image = FileUploadHelper::uploadImg(
                $fullpath,
                $file = $_FILES['profile_img'],
                $imageName.'.png'
            );
            $imageResizer = new ImageResizerHelper("profiles/$id/$imageName.png");
            $imageResizer->multipleResizeMaxHeight(
                "profiles/$id/$imageName",
                [256, 128, 64, 32, 24]
            );

            $this->User->updateAvatar(
                $id,
                $basepath.$imageName
            );
            return $this->responseOk();
        } catch (Exception $e) {
            throw new InternalErrorException($e->getMessage());
        }
    }
}