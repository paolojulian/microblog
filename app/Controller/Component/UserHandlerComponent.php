<?php

App::uses('Component', 'Controller');
App::uses('ImageResizerHelper', 'PImage');
App::uses('FileUploadHelper', 'PFile');

class UserHandlerComponent extends Component {

    public $components = ['MailHandler'];

    /**
     * Handles the sending of mail for account activation
     * Assumes everything in data is already validated
     * 
     * @param array $data - User Object
     */
    public function sendActivationMail($data)
    {
        $name = $data['first_name'] . ' ' . $data['last_name'];
        $to = $data['email'];
        $subject = 'Account Activation';
        $activationUrl = Router::url([
            'controller' => 'users',
            'action' => 'activate/' . $data['activation_key']
        ], true);
        $message = "Dear <span color='red'>$name</span>";
        $message .= "<br />Your account has been created successfully.<br />";
        $message .= "<b>In order to get started, please click the link below to activate your account</b>";
        $message .= "<br/><b><a href='$activationUrl.json'>$activationUrl</a></b>";
        $message .= "<br />Thank you very much!<br />-Pipz";

        $this->MailHandler->sendHTMLMail($to, $subject, $message);
        return true;
    }

    public function uploadimage($user, $file)
    {
        try {
            $id = $user['id'];
            $cleanedUsername = preg_replace('/[^A-Za-z0-9]/', '', $user['username']);
            $imageName = $cleanedUsername . time();
            $imgpath = "/img/profiles/$id/";
            $fullpath = WWW_ROOT . $imgpath;
            $image = FileUploadHelper::uploadImg(
                $fullpath,
                $file,
                $imageName.'.png'
            );
            $imageResizer = new ImageResizerHelper("profiles/$id/$imageName.png");
            $imageResizer->multipleResizeMaxHeight(
                "profiles/$id/$imageName",
                [256, 128, 64, 32, 24]
            );
        } catch (Exception $e) {
            throw $e;
        }

        return "/app/webroot$imgpath$imageName";
    }
}