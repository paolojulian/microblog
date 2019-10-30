<?php

App::uses('ImageHelper', 'PImage');
/**
 * TODO: Refractor
 */
class ImageResizerHelper extends ImageHelper
{
    private $resizedImage;
    private $resizedWidth;
    private $resizedHeight;

    public function multipleResizeMaxHeight($basename, $sizes)
    {
        foreach ($sizes as $size) {
            $this->resizeTo(0, $size, 'maxheight');
            $this->saveImage($basename."x$size.png");
        }
    }

    public function multipleResizeMaxWidth($basename, $sizes)
    {
        foreach ($sizes as $size) {
            $this->resizeTo($size, 0, 'maxwidth');
            $this->saveImage($basename."x$size.png");
        }
    }

    public function resizeTo($width, $height, $resizeOption = 'default')
    {
        switch(strtolower($resizeOption)) {
            case 'exact':
                $this->resizeExactHandler($width, $height);
                break;
            case 'maxwidth':
                $this->resizeMaxWidthHandler($width, $height);
                break;
            case 'maxheight':
                $this->resizeMaxHeightHandler($width, $height);
                break;
            default:
                $this->resizeDefaultHandler($width, $height);
                break;
		}
		$this->resizedImage = imagecreatetruecolor($this->resizedWidth, $this->resizedHeight);
        imagecopyresampled(
            $this->resizedImage,
            $this->image,
            0, 0, 0, 0,
            $this->resizedWidth,
            $this->resizedHeight,
            $this->origWidth,
            $this->origHeight
        );
    }

    private function resizeExactHandler(int $width, int $height)
    {
        $this->resizedWidth = $width;
        $this->resizedHeight = $height;
    }

    /**
     * Resize the height by its width keeping its aspect ratio
     */
    private function resizeMaxWidthHandler($width, $height)
    {
        $this->resizedWidth = $width;
        $this->resizedHeight = floor(($this->origHeight / $this->origWidth) * $width);
    }

    /**
     * Resize the width by its height keeping its aspect ratio
     */
    private function resizeMaxHeightHandler(int $width, int $height)
    {
        $this->resizedWidth = floor(($this->origWidth / $this->origHeight) * $height);
        $this->resizedHeight = $height;
    }

    private function resizeDefaultHandler(int $width, int $height)
    {
        // If both requested dimensions is lesser than original dimensions
        // Set it as new dimensions
        if ($this->origWidth < $width && $this->origHeight < $height) {
            return $this->resizeExactHandler($width, $height);
        }

        if ($this->origWidth > $this->origHeight) {
            return $this->resizeMaxWidthHandler($width, $height);
        }

        if ($this->origWidth < $this->origHeight) {
            return $this->resizeMaxHeightHandler($width, $height);
        }

        $this->resizedWidth = $this->origWidth;
        $this->resizedHeight = $this->origHeight;
    }

    public function saveImage($savePath, $imageQuality="100", $download = false)
	{
        $savePath = static::IMG_BASEPATH.$savePath;
	    switch($this->extension) {
	        case 'image/jpg':
	        case 'image/jpeg':
	            if (imagetypes() & IMG_JPG) {
	                imagejpeg($this->resizedImage, $savePath, $imageQuality);
                }
	            break;
	        case 'image/gif':
	            if (imagetypes() & IMG_GIF) {
	                imagegif($this->resizedImage, $savePath);
	            }
	            break;
	        case 'image/png':
	            $invertScaleQuality = 9 - round(($imageQuality/100) * 9);
	            if (imagetypes() & IMG_PNG) {
	                imagepng($this->resizedImage, $savePath, $invertScaleQuality);
	            }
                break;
	    }
	    if ($download) {
	    	header('Content-Description: File Transfer');
            header("Content-type: application/octet-stream");
            header("Content-disposition: attachment; filename= ".$savePath."");
            readfile($savePath);
	    }
	    imagedestroy($this->resizedImage);
	}
}