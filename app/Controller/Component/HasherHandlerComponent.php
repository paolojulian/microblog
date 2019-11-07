<?php

App::uses('Component', 'Controller');
App::uses('Security', 'Utility');

class HasherHandlerComponent extends Component {

    /**
     * Generates a random hash
     * 
     * @return string
     */
    public function generateRand($key = 'J0hNM4Y3R')
    {
        $timeStr = str_replace("0.", "", microtime());
        $timeStr = str_replace(" ", "", $timeStr);
        return Security::hash($key).'_'.$timeStr;
    }
}