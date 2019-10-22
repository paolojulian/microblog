<?php

App::uses('Component', 'Controller');
App::uses('CakeEmail', 'Network/Email');

class MailHandlerComponent extends Component {

    public function sendHTMLMail($to, $subject, $message)
    {
        $email = new CakeEmail();
        $email->config('gmail');
        $email->emailFormat('html');
        $email->to($to);
        $email->subject($subject);
        $email->send($message);
    }
}