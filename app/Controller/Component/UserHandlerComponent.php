<?php

App::uses('Component', 'Controller');

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
        $message .= "<br/><b><a href='$activationUrl'>$activationUrl</a></b>";
        $message .= "<br />Thank you very much! Pipz";

        $this->MailHandler->sendHTMLMail($to, $subject, $message);
    }
}