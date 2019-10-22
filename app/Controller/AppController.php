<?php
/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 */

App::uses('Controller', 'Controller');
App::uses('User', 'Model');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package		app.Controller
 * @link		https://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller {
    public $components = [
        'Auth' => [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => 'Blowfish'
                ],
                'Basic' => [
                    'passwordHasher' => 'Blowfish'
                ]
            ],
            'unauthorizedRedirect' => [
                'controller' => 'users',
                'action' => 'accessDenied'
            ],
            'authorize' => ['controller'],
        ]
    ];
    
    public function beforeFilter() {
        $this->Auth->allow('index', 'view');
    }
    
    public function isAuthorized($user) {
        // Admin can access every action
        if (isset($user['role']) && $user['role'] === 'ADMIN') {
            return true;
        }

        throw new ForbiddenException('Unauthorized');
    }

    public function accessDenied()
    {
        $this->jsonResponse(401);
    }

    protected function jsonResponse($status = 200, $message = '', $data = [])
    {
        $this->response->statusCode($status);
        return $this->set([
            'status' => $status,
            'message' => $message,
            'data' => $data,
            '_serialize' => ['data', 'status', 'message'],
            '_jsonp' => true
        ]);
    }

    protected function responseOK($message = '', $data = [])
    {
        $this->jsonResponse(200, $message, $data);
    }

    protected function responseData($data = [])
    {
        $this->jsonResponse(200, '', $data);
    }

    protected function responseUnprocessableEntity($message = '', $data = [])
    {
        $this->jsonResponse(400, $message, ['errors' => $data]);
    }

    protected function responseDeleted($message = '')
    {
        $this->jsonResponse(204, $message);
    }

    protected function responseInternalServerError()
    {
        $this->jsonResponse(500);
    }

    protected function responseCreated($data = [])
    {
        $this->jsonResponse(200, '', $data);
    }

    protected function responseNotFound()
    {
        $this->jsonResponse(404);
    }

    protected function responseForbidden()
    {
        $this->jsonResponse(403);
    }
}
