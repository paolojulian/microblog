<?php

class FileUploadHelper
{
    const FILE_BASEPATH = WWW_ROOT;
    // List of allowed file types
    const IMG_ALLOWED = ['jpg', 'jpeg', 'gif', 'png'];
    // TODO Add Max Size
    // const MAX_SIZE = 0;

    public static function uploadImg(
        $filePath,
        $file,
        $fileName=""
    ) {
        $fileName = ! empty($fileName) ? $fileName: pathinfo($file['name'], PATHINFO_BASENAME);
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fullPath = $filePath . $fileName;

        // Check if the file has not yet been uploaded to tmp
        if ( ! $file['tmp_name'])
            throw new \Exception("Image was not uploaded to tmp");

        // Create a directory if specified path is not yet present
        if ( ! is_dir($filePath)) {
            mkdir($filePath);
        }

        // Check if extension is allowed
        if ( ! in_array($fileExtension, self::IMG_ALLOWED)) {
            throw new \RangeException("Unsupported File Type");
        }
    
        if ( ! move_uploaded_file($file['tmp_name'], $fullPath)) {
            throw new \Exception("Could not upload a file");
        }

        // Image Uploaded
        return $fileName;
    }
}