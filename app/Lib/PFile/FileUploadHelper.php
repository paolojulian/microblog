<?php

class FileUploadHelper
{
    const FILE_BASEPATH = WWW_ROOT;
    // List of allowed file types
    const IMG_ALLOWED = ['jpg', 'jpeg', 'gif', 'png'];
    // The limit for img size
    const MAX_SIZE = 1048576 * 25; // 25mb
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
            throw new InternalErrorException("Image was not uploaded to tmp");

        // Check if extension is allowed
        if ( ! in_array($fileExtension, self::IMG_ALLOWED)) {
            throw new UnsupportedFileTypeException();
        }

        // Check if uploaded filesize is valid
        if (filesize($file['tmp_name']) > self::MAX_SIZE) {
            throw new PayloadTooLarge('Can only upload up to 25 mb');
        }

        // Create a directory if specified path is not yet present
        if ( ! is_dir($filePath)) {
            mkdir($filePath);
        }
    
        if ( ! move_uploaded_file($file['tmp_name'], $fullPath)) {
            throw new InternalErrorException("Could not upload a file");
        }

        // Image Uploaded
        return $fileName;
    }
}