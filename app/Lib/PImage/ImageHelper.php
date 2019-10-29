<?php

class ImageHelper
{
    const IMG_BASEPATH = WWW_ROOT . 'img/';
    protected $image;
    protected $extension;
    protected $origWidth;
    protected $origHeight;

    public function __construct($filename) {
        $filename = static::IMG_BASEPATH . $filename;
        if ( ! file_exists($filename)) {
            throw new NotFoundException("File not found " + $filename);
        }

        $this->setImage($filename);
    }

    private function setImage($filename)
    {
        $size = getimagesize($filename);
        $this->extension = $size['mime'];

        switch ($this->extension) {
            case 'image/jpg':
            case 'image/jpeg':
                $this->image = imagecreatefromjpeg($filename);
                break;
            case 'image/gif':
                $this->image = @imagecreatefromgif($filename);
                break;
            case 'image/png':
                $this->image = @imagecreatefrompng($filename);
                break;
            default:
                // Invalid Mime type
                throw new \InvalidArgumentException("Uploaded file is not an image.");
        }
    
        $this->origWidth = imagesx($this->image);
        $this->origHeight = imagesy($this->image);
    }
}