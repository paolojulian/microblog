<?php
App::uses('BaseAuthenticate', 'Controller/Component/Auth');

class JwtTokenAuthenticate extends BaseAuthenticate
{
	public $settings = array(
		'fields' => array(
			'username' => 'username',
			'token' => 'token'
		),
		'parameter' => '_token',
		'header' => 'X_JSON_WEB_TOKEN',
		'userModel' => 'User',
		'scope' => array(),
		'recursive' => 0,
		'contain' => null,
		'pepper' => '123'
	);
	public function __construct(ComponentCollection $collection, $settings) {
		parent::__construct($collection, $settings);
		if (empty($this->settings['parameter']) && empty($this->settings['header'])) {
			throw new CakeException(__d('jwt_auth', 'You need to specify token parameter and/or header'));
		}
	}
	public function authenticate(CakeRequest $request, CakeResponse $response) {
		return false;
	}
	public function getUser(CakeRequest $request) {
		$token = $this->_getToken($request);
		if ($token) {
			return $this->_findUser($token);
		}
		return false;
	}
	private function _getToken(CakeRequest $request)
	{
		if (!empty($this->settings['header'])) {
			$token = $request->header($this->settings['header']);
			if ($token) {
				return $token;
			}
		}
		if (!empty($this->settings['parameter']) && !empty($request->query[$this->settings['parameter']])) {
			return $request->query[$this->settings['parameter']];
		}
		return false;
	}
	public function _findUser($token, $password = null)
	{
		$token = JWT::decode($token, $this->settings['pepper'], array('HS256'));
		if (isset($token->record)) {
			// Trick to convert object of stdClass to array. Typecasting to
			// array doesn't convert property values which are themselves objects.
			return json_decode(json_encode($token->record), true);
		}
		$userModel = $this->settings['userModel'];
		list($plugin, $model) = pluginSplit($userModel);
		$fields = $this->settings['fields'];
		$conditions = array(
			$model . '.' . $fields['username'] => $token->user->name,
			$model . '.' . $fields['token'] => $token->user->token
		);
		if (!empty($this->settings['scope'])) {
			$conditions = array_merge($conditions, $this->settings['scope']);
		}
		$result = ClassRegistry::init($userModel)->find('first', array(
			'conditions' => $conditions,
			'recursive' => (int)$this->settings['recursive'],
			'contain' => $this->settings['contain'],
		));
		if (empty($result) || empty($result[$model])) {
			return false;
		}
		$user = $result[$model];
		unset($result[$model]);
		return array_merge($user, $result);
	}
}