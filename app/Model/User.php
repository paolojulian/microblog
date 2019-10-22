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
        'Follower' => [
            'className' => 'Follower',
            'foreignkey' => 'user_id'
        ],
        'Following' => [
            'className' => 'Follower',
            'foreignkey' => 'following_id'
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
            'alphaNumeric' => [
                'rule' => 'alphaNumeric',
                'required' => true,
                'message' => 'Letters and Numbers only'
            ],
            'between' => [
                'rule' => ['lengthBetween', 6, 20],
                'required' => true,
                'message' => 'Between 6 to 20 characters only'
            ],
            'unique' => [
                'rule' => 'isUnique',
                'message' => 'Username provided already exists.'
            ]
        ],
        'email' => [
            'required' => [
                'rule' => ['email'],
                'required' => true,
                'message' => 'Kindly provide your email for verification.'
            ],
            'maxlength' => [
                'rule' => ['maxLength', 50],
                'required' => true,
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
                'required' => true
            ]
        ],
        'password' => [
            'minLength' => [
                'rule' => ['minLength', 6],
                'required' => 'create',
                'message' => 'Minimum of 6 characters is allowed.'
            ],
        ],
        'role' => [
            'valid' => [
                'rule' => ['inList', self::ROLES],
                'message' => 'Please enter a valid role',
                'allowEmpty' => true
            ]
        ]
    ];

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

    public function beforeSave($options = [])
    {
        if ( ! isset($this->data[$this->alias]['password'])) return true;

        $passwordHasher = new BlowfishPasswordHasher();
        $this->data[$this->alias]['password'] = $passwordHasher->hash(
            $this->data[$this->alias]['password']
        );
        return true;
    }

    public function authenticate($data)
    {
        $user = $this->find('first', [
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
}