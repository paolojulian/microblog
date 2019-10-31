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

App::uses('JWT', 'Lib');

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
    public $public = [];
    // public $components = ['DebugKit.Toolbar'];
    
    public function beforeFilter() {
        if (in_array($this->action, $this->public)) {
            return;
        }
        try {
            $decoded = self::getDecodedHeader();
            // Check if post to be edited belongs to self
            return true;
        } catch (Exception $e) {
            throw new ForbiddenException('Unauthorized');
        }
        throw new ForbiddenException('Unauthorized');
    }

    public function getDecodedHeader()
    {
        try {
            $httpAuthorization = $this->request->header('Authorization');
            if ( ! isset($httpAuthorization) && empty($httpAuthorization)) {
                throw new ForbiddenException('Unauthorized');
            }
            $secretKey = Configure::read('jwt.key');
            $decoded = JWT::decode($httpAuthorization, $secretKey, ['HS256']);
            $this->request->user = $decoded;
            return $decoded;

        } catch (Exception $e) {
            throw new ForbiddenException('Unauthorized');
        }
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
        $this->jsonResponse(422, $message, ['errors' => $data]);
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

    public function jwtEncode($payload) {
        $time = time();
        $key = "example_key";
        $payload['iss'] = "Pipz";
        $payload['aud'] = "Microblog";
        $payload['iat'] = $time;
        $payload['nbf'] = $time;
        $payload['exp'] = $time + 86400;// One day expiration
        $secretKey = Configure::read('jwt.key');
        return JWT::encode($payload, $secretKey, 'HS256');
    }

    public function jwtDecode($jwt)
    {
        if ( ! isset($jwt) && empty($jwt)) {
            return false;
        }

        try {
            $secretKey = Configure::read('jwt.key');
            $decoded = JWT::decode($jwt, $secretKey, ['HS256']);
            if ($decoded) {
                return true;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function isOwnedBy($model, $userId)
    {
        $reqId = (int) $this->request->params['pass'][0];
        if ( ! $model->isOwnedBy($reqId, $userId)) {
            throw new ForbiddenException();
        }
        return true;
    }
}
