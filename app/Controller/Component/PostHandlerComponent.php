<?php

App::uses('Component', 'Controller');
App::uses('ImageResizerHelper', 'PImage');
App::uses('FileUploadHelper', 'PFile');

class PostHandlerComponent extends Component {

    /**
     * Uploads the image used for post
     * 
     * @param object $imgFile - An img $_FILES object
     * @param int $userId - User Currently Logged in
     * @param array $data - User Object
     * @return string baseName of the file
     */
    public function uploadImage($imgFile, $userId, $data)
    {
        try {
            $title = preg_replace('/[^A-Za-z0-9]/', '', $data['title']);
            $imageName = $userId . $title . time();
            $imgpath = "img/posts/";
            $fullpath = WWW_ROOT . $imgpath;
            $image = FileUploadHelper::uploadImg(
                $fullpath,
                $imgFile,
                $imageName.'.png'
            );
            $imageResizer = new ImageResizerHelper("posts/$imageName.png");
            $imageResizer->multipleResizeMaxWidth(
                "posts/$imageName",
                [512, 256]
            );
        } catch (Exception $e) {
            throw $e;
        }

        return "/app/webroot/$imgpath$imageName";
    }
}