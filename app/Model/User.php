<?php

App::uses('AppModel', 'Model');
App::uses('AuthComponent', 'Controller/Component');
App::uses('BlowfishPasswordHasher', 'Controller/Component/Auth');

class User extends AppModel
{

    const ROLES = ['ADMIN', 'USER'];
    const SEX = ['M', 'F'];

    public $actsAs = ['Containable'];
    public $hasMany = [
        'FollowerCount' => [
            'className' => 'Follower',
            'foreignKey' => 'following_id',
            'counterCache' => [
                'id' => ['id >', 0]
            ]
        ],
        'Post' => [
            'className' => 'Post',
            'order' => 'Post.modified DESC',
            'fields' => ['username']
        ]
    ];

    public $validate = [
        'first_name' => [
            'notBlank' => [
                'rule' => 'notBlank',
                'message' => 'Please enter your first name.',
                'required' => true,
            ],
            'between' => [
                'rule' => ['lengthBetween', 1, 70],
                'required' => true,
                'message' => 'Between 1 to 70 characters only'
            ],
        ],
        'last_name' => [
            'notBlank' => [
                'rule' => 'notBlank',
                'message' => 'Please enter your last name.',
                'required' => true,
            ],
            'between' => [
                'rule' => ['maxLength', 35],
                'required' => true,
                'message' => 'Maximum of 35 characters only'
            ],
            'alphaNumeric' => [
                'rule' => 'alphaNumeric',
                'required' => true,
                'message' => 'Letters and Numbers only'
            ],
        ],
        'username' => [
            'notBlank' => [
                'rule' => 'notBlank',
                'message' => 'Please enter your username.',
                'required' => true,
            ],
            'between' => [
                'rule' => ['lengthBetween', 6, 20],
                'required' => true,
                'message' => 'Between 6 to 20 characters only'
            ],
            'alphaNumeric' => [
                'rule' => 'alphaNumeric',
                'required' => true,
                'message' => 'Letters and Numbers only'
            ],
            'unique' => [
                'rule' => 'isUnique',
                'message' => 'Username provided already exists.'
            ]
        ],
        'email' => [
            'required' => [
                'rule' => ['email'],
                'required' => 'create',
                'message' => 'Kindly provide your email for verification.'
            ],
            'maxlength' => [
                'rule' => ['maxLength', 50],
                'required' => 'create',
                'message' => 'Only 50 characters is allowed.'
            ],
            'unique' => [
                'rule' => 'isUnique',
                'message' => 'Email provided already exists.'
            ]
        ],
        'birthdate' => [
            'notBlank' => [
                'rule' => 'notBlank',
                'required' => true,
                'message' => 'Please enter your birthdate'
            ],
            'validDate' => [
                'rule' => ['date'],
                'required' => true,
                'message' => 'Please enter a valid date'
            ]
        ],
        'sex' => [
            'valid' => [
                'rule' => ['inList', self::SEX],
                'message' => 'Please enter a valid sex.',
                'required' => 'create'
            ]
        ],
        'password' => [
            'minLength' => [
                'rule' => ['minLength', 6],
                'required' => 'create',
                'message' => 'Minimum of 6 characters is allowed.'
            ],
        ],
        'confirm_password' => [
            'identical' => [
                'rule' => ['identicalFieldValues', 'password'],
                'message' => 'Password confirmation does not match password.'
            ]
        ],
        'role' => [
            'valid' => [
                'rule' => ['inList', self::ROLES],
                'message' => 'Please enter a valid role',
                'allowEmpty' => true
            ]
        ]
    ];

    public function findById($userId, $fields = '*')
    {
        return $this->find('first', [
            'recursive' => -1,
            'fields' => $fields,
            'conditions' => ['id' => $userId]
        ]);
    }

    public function findByUsername($username, $fields = '*')
    {
        return $this->find('first', [
            'recursive' => -1,
            'fields' => $fields,
            'conditions' => ['username' => $username]
        ]);
    }

    public function findByActivationKey($key, $fields = '*')
    {
        return $this->find('first', [
            'recursive' => -1,
            'fields' => $fields,
            'conditions' => ['activation_key' => $key]
        ]);
    }

    /**
     * TODO
     * For a better searching of user, display users with mutual
     * followers first
     * 
     * @param int $userId - user logged in shouldnt be included in the search
     * @param string $searchText - text to be searched
     */
    public function searchUser($searchText, $userId = null, $page = 1)
    {
        $perPage = 5;
        $searchText = trim($searchText);
        return $this->find('all', [
            'recursive' => -1,
            'fields' => ['id', 'username', 'first_name', 'last_name', 'avatar_url'],
            'conditions' => [
                'OR' => [
                    'username LIKE' => "%$searchText%",
                    "concat_ws(' ', first_name, last_name) LIKE" => "%$searchText%",
                ],
                'id !=' => $userId,
                'deleted' => null,
                'is_activated' => 1
            ],
            'order' => 'created DESC',
            'limit' => $perPage,
            'page' => $page
        ]);
    }

    public function addUser($data)
    {
        $this->set($data);
        if ( ! $this->validates()) {
            return false;
        }
        if ( ! $this->save()) {
            throw new InternalErrorException();
        }
        return true;
    }

    public function activateUser($userId)
    {
        $this->id = $userId;
        if ( ! $this->saveField('is_activated', b'1')) {
            throw new InternalErrorException();
        }
        return true;
    }

    public function updateAvatar($userId, $fullpath)
    {
        $this->id = $userId;
        if ( ! $this->saveField('avatar_url', $fullpath)) {
            throw new InternalErrorException();
        }
        return true;
    }

    public function editUser($userId, $data)
    {
        $this->id = $userId;
        $user = $this->findById($this->id);
        if ( ! $user) {
            throw new NotFoundException(__('Invalid user'));
        }

        // Add validation if the user decides to change his password
        if (isset($data['old_password']) && ! empty($data['old_password'])) {
            $passwordHasher = new BlowfishPasswordHasher();
            if ( ! $passwordHasher->check($data['old_password'], $user['User']['password'])) {
                $this->validationErrors['old_password'] = 'You entered a wrong password';
                return false;
            }
            $this->validator()
                ->getField('password')
                ->getRule('minLength')
                ->required = true;
        } else if (isset($data['password'])) {
            throw new BadMethodCallException(__("Passing password to form data without old password"));
        }

        $this->set($data);
        if ( ! $this->validates()) {
            return false;
        }

        if ( ! $this->save()) {
            throw new InternalErrorException();
        }

        return true;
    }

    public function authenticate($data)
    {
        $user = $this->find('first', [
            'recursive' => true,
            'conditions' => ['username' => $data['username']],
        ]);
        if ( ! $user) {
            return false;
        }
        $passwordHasher = new BlowfishPasswordHasher();
        if ( ! $passwordHasher->check($data['password'], $user['User']['password'])) {
            return false;
        }

        unset($user['User']['password']);  // Remove password for saving
        return $user;
    }

	public function identicalFieldValues($data, $compareField) {
		$value = array_values($data);
		$comparewithvalue = $value[0];
		return $this->data[$this->name][$compareField] === $comparewithvalue;
    }

    public function beforeSave($options = [])
    {
        if ( ! isset($this->data[$this->alias]['password'])) return true;

        $passwordHasher = new BlowfishPasswordHasher();
        $this->data[$this->alias]['password'] = $passwordHasher->hash(
            $this->data[$this->alias]['password']
        );
        return true;
    }
}