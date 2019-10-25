import React, { Component } from 'react';
import axios from 'axios'
import { Provider } from 'react-redux'
import jwtDecode from 'jwt-decode'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

/* Redux */
import store from './store'
import { GET_ERRORS } from './store/types'
import { logoutUser, setCurrentUser } from './store/actions/authActions'

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <p>Hello World</p>
    );
  }
}

export default App;