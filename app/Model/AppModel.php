<?php
/**
 * Application model for CakePHP.
 *
 * This file is application-wide model file. You can put all
 * application-wide model-related methods here.
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
 * @package       app.Model
 * @since         CakePHP(tm) v 0.2.9
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 */

// App::uses('Model', 'Model');
// App::uses('SoftDeletableModel', 'CakeSoftDelete.Model');
App::uses('SoftDeletableModel', 'Model');

/**
 * Application model for Cake.
 *
 * Add your application-wide methods in the class below, your models
 * will inherit them.
 *
 * @package       app.Model
 */
class AppModel extends SoftDeletableModel {

    public function beforeValidate($options = [])
    {
        foreach ($this->data[$this->alias] as $key => $value) {
            if (is_string($value)) {
                $this->data[$this->alias][$key] = trim($value);
            }
        }
    }

    public function notGreaterThanToday($check)
    {
        try {
            $dateToCheck = strtotime($check['birthdate']);
            $now = time();
            return $dateToCheck < $now;
        } catch (Exception $e) {
            return false;
        }
    }
}
