<?php

App::uses('AppController', 'Controller');

class UsersController extends AppController {
    public $components = ['RequestHandler'];

    public function beforeFilter() {
        parent::beforeFilter();

        // Allows register and logout without auth
        $this->Auth->allow('add', 'login', 'accessDenied');
    }

    public function index() {
        $this->User->recursive = 0;
        $this->set('users', $this->paginate());
    }

    public function view($id = null) {
        $this->User->id = $id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }
        $this->set('user', $this->User->findById($id));
    }

    public function add() {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $this->User->set($this->request->data);
        if ( ! $this->User->validates()) {
            return $this->responseUnprocessableEntity('', $this->User->validationErrors);
        }

        if ( ! $this->User->save($this->request->data)) {
            throw new InternalErrorException();
        }

        return $this->responseOK();
    }

    public function edit() {
        if ( ! $this->request->is('put')) {
            throw new MethodNotAllowedException();
        }

        $this->User->id = $this->Auth->user('id');
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }

        $this->User->set($this->request->data);
        if ( ! $this->User->validates()) {
            return $this->responseUnprocessableEntity('', $this->User->validationErrors);
        }

        if ( ! $this->User->save($this->request->data)) {
            throw new InternalErrorException();
        }

        return $this->responseOK();
    }

    public function delete($id = null) {
        $this->User->id = $id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }
        if ($this->User->delete()) {
            $this->Flash->success(__('User deleted'));
            return $this->redirect(array('action' => 'index'));
        }
        $this->Flash->error(__('User was not deleted'));
        return $this->redirect(array('action' => 'index'));
    }

    public function login()
    {
        if ( ! $this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        $user = $this->User->authenticate($this->request->data);
        if ( ! $user) {
            throw new BadRequestException(__('Invalid Username or Password'));
        }

        if ($user['User']['is_activated'] != 1) {
            throw new BadRequestException('Please activate your account first.');
        }

        if ( ! $this->Auth->login($user['User'])) {
            throw new InternalErrorException();
        }

        return $this->responseOK();
    }

    public function logout()
    {
        $this->Auth->logout();
        return $this->responseOK();
    }

    public function me()
    {
        if ( ! $this->request->is('get')) {
            throw new MethodNotAllowedException();
        }
        return $this->responseData($this->Auth->user());
    }

    public function accessDenied()
    {
        $this->jsonResponse(401);
    }

    public function isAuthorized($user) {

        if (in_array($this->action, ['me', 'logout', 'edit'])) {
            if ($this->Auth->user()) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

}