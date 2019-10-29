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
            'id, username, first_name, last_name, email, birthdate, sex'
        );
        return $this->responseData([
            'user' => $user["User"],
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
            'id, username, first_name, last_name, email, birthdate, sex'
        );
        return $this->responseData([
            'user' => $user["User"],
            'totalFollowers' => $this->Follower->countFollowers($this->request->user->id),
            'totalFollowing' => $this->Follower->countFollowing($this->request->user->id),
        ]);
    }

    public function uploadimage()
    {
        $this->request->allowMethod('post');
        try {
            $id = $this->request->user->id;
            $username = $this->request->user->username;
            $path = WWW_ROOT . "/img/profiles/$id/";
            $image = FileUploadHelper::uploadImg(
                $path, // file path
                $file = $_FILES['profile_img'], // file
                $imageName = $username.".png" // file name
            );
            $imageResizer = new ImageResizerHelper("profiles/$id/$imageName");
            $imageResizer->multipleResizeMaxWidth(
                "profiles/$id/$username",
                [256, 128, 64, 32, 24]
            );
            return $this->responseOk();
        } catch (Exception $e) {
            throw new InternalErrorException(__('Unable to upload file'));
        }
    }
}