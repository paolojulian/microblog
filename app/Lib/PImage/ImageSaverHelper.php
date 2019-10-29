<?php

class ImageSaverHelper
{

    public function saveImage($savePath, $imageQuality="100", $download = false)
	{
	    switch($this->ext) {
	        case 'image/jpg':
	        case 'image/jpeg':
	        	// Check PHP supports this file type
	            if (imagetypes() & IMG_JPG) {
	                imagejpeg($this->newImage, $savePath, $imageQuality);
	            }
	            break;
	        case 'image/gif':
	        	// Check PHP supports this file type
	            if (imagetypes() & IMG_GIF) {
	                imagegif($this->newImage, $savePath);
	            }
	            break;
	        case 'image/png':
	            $invertScaleQuality = 9 - round(($imageQuality/100) * 9);
	            // Check PHP supports this file type
	            if (imagetypes() & IMG_PNG) {
	                imagepng($this->newImage, $savePath, $invertScaleQuality);
	            }
	            break;
	    }
	    if($download)
	    {
	    	header('Content-Description: File Transfer');
			header("Content-type: application/octet-stream");
			header("Content-disposition: attachment; filename= ".$savePath."");
			readfile($savePath);
	    }
	    imagedestroy($this->newImage);
	}
}