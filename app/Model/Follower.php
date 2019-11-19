<?php

class Follower extends AppModel
{
    public $actsAs = ['SoftDeletable'];
    public $belongsTo = [
        'User' => [
            'className' => 'User',
        ],
        'Following' => [
            'className' => 'User',
            'foreignKey' => 'following_id'
        ],
    ];

    public $validate = [
        'user_id' => [
            'rule' => 'notBlank',
            'required' => true
        ],
        'following_id' => [
            'rule' => 'notBlank',
            'required' => true
        ]
    ];

    /**
     * Checks if user follows a certain user
     * @param int $userId
     * @param int $followingId
     */
    public function isFollowing($userId, $followingId)
    {
        return $this->hasAny([
            'user_id' => $userId,
            'following_id' => $followingId
        ]);
    }

    /**
     * TODO: this function serves two purposes, refractor it
     * Fetches all followers of given user
     * and checks if current logged in user is following
     * 
     * @param int $userId - user to fetch followers
     * @param int $page
     * @param int $loggedInUser
     * 
     * @return array - array of followers
     */
    public function fetchFollowersOfUser($userId, $page, $loggedInUser)
    {
        $perPage = 10;
        $followers = $this->find('all', [
            'contain' => ['User'],
            'fields' => [
                'User.id',
                'User.username',
                'User.first_name',
                'User.last_name',
                'User.avatar_url'
            ],
            'order' => 'Follower.created DESC',
            'conditions' => [
                'following_id' => $userId
            ],
            'limit' => $perPage,
            'page' => $page,
        ]);

        foreach ($followers as $key => $follower) {
            $followers[$key]['User']['is_following'] = $this->isFollowing(
                $loggedInUser,
                $follower['User']['id']
            );
        }

        return $followers;
    }

    /**
     * TODO: this function serves two purposes, refractor it
     * Fetches all users followed by the given user
     * and checks if current logged in user is following
     * 
     * @param int $userId - user to fetch followed users
     * @param int $page
     * @param int $loggedInUser
     * 
     * @return array - array of followers
     */
    public function fetchFollowedByUser($userId, $page, $loggedInUser)
    {
        $perPage = 10;
        $followers = $this->find('all', [
            'contain' => ['Following'],
            'fields' => [
                'Following.id',
                'Following.username',
                'Following.first_name',
                'Following.last_name',
                'Following.avatar_url'
            ],
            'order' => 'Follower.created DESC',
            'conditions' => [
                'Follower.user_id' => $userId
            ],
            'limit' => $perPage,
            'page' => $page,
        ]);

        foreach ($followers as $key => $follower) {
            $followers[$key]['Following']['is_following'] = $this->isFollowing(
                $loggedInUser,
                $follower['Following']['id']
            );
        }
        return $followers;
    }

    /**
     * Counts the followers of the user
     * 
     * @param int $userId - users.id
     * @return int
     */
    public function countFollowers($userId)
    {
        return $this->find('count', [
            'conditions' => ['following_id' => $userId]
        ]);
    }

    /**
     * Counts the users that the given user is following
     * 
     * @param int $userId - users.id
     * @return int
     */
    public function countFollowing($userId)
    {
        return $this->find('count', [
            'conditions' => ['user_id' => $userId]
        ]);
    }

    public function isOwnedBy($followerId, $user)
    {
        $params = [
            'following_id' => $followerId,
            'user_id' => $user
        ];
        return $this->field('id', $params) !== false;
    }

}