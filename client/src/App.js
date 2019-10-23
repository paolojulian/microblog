import React from 'react';
import axios from 'axios'
import { Provider } from 'react-redux'
import jwtDecode from 'jwt-decode'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

/* Redux */
import store from './store'
import { GET_ERRORS } from './store/types'
import { logoutUser, setCurrentUser } from './store/actions/authActions'

/* Styles */
import './assets/styles/App.css'
import './assets/styles/Form.css'

/* Components */
import PrivateRoute from './components/widgets/private-route'
import Landing from './components/landing'
import Login from './components/auth/login'
import Register from './components/auth/register'

if (localStorage.jwtToken) {
    const decoded = jwtDecode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decoded))

    // Logout and redirect if token expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/login'
    }
}

axios.interceptors.response.use(config => {
    return config;
}, err => {
    switch (err.response.status) {
        case 401:
            store.dispatch(logoutUser());
            // store.dispatch(clearProfile());
            window.location.href = '/login'
            break;
        case 422:
            store.dispatch({
                type: GET_ERRORS,
                payload: err.response.data.data.errors
            });
            break;
        default:
            break;
    }

    return Promise.reject(err);
});

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Switch>
                        <PrivateRoute exact path="/" component={Landing}/>
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
