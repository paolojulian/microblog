import React, { lazy , Suspense } from 'react';
import axios from 'axios'
import { Provider } from 'react-redux'
import jwtDecode from 'jwt-decode'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

/* Redux */
import store from './store'
import setTokenToAuthHeader from './utils/setTokenToAuthHeader';
import { GET_ERRORS } from './store/types'
import { logoutUser, setCurrentUser } from './store/actions/authActions'

/* Components */
import PrivateRoute from './components/widgets/private-route'
import VNofication from './components/widgets/v-notification'
import NoMatch from './components/nomatch/index.jsx'
/** Context */
import { ModalProvider } from './components/widgets/p-modal/p-modal-context'
import ModalRoot from './components/widgets/p-modal/p-modal-root'
import Loader from './components/loader';

const Login = lazy(() => import('./components/auth/login'));
const Register = lazy(() => import('./components/auth/register'));
const Landing = lazy(() => import('./components/landing'));
const Profile = lazy(() => import('./components/profile'));
const ProfileUpdate = lazy(() => import('./components/profile/update'));
const PostEdit = lazy(() => import('./components/post/edit'));
const PostView = lazy(() => import('./components/post/view'));
const PSearch = lazy(() => import('./components/search'));

if (localStorage.jwtToken) {
    try {
        setTokenToAuthHeader(localStorage.jwtToken);
        const decoded = jwtDecode(localStorage.jwtToken);
        store.dispatch(setCurrentUser(decoded))

        // Logout and redirect if token expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            store.dispatch(logoutUser());
            window.location.href = '/login'
        }
    } catch (e) {
        console.error(e);
        store.dispatch(logoutUser());
        window.location.href = '/login'
    }
}

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.interceptors.response.use(config => {
    return config;
}, err => {
    if ( ! err.response) {
        return false;
    }
    switch (err.response.status) {
        case 404:
            window.location.href = '/not-found'
            break;
        case 403:
            // No break
        case 401:
            store.dispatch(logoutUser());
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
                    <ModalProvider>
                        <ModalRoot/>

                        <Suspense fallback={<Loader/>}>
                        <Switch>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/register" component={Register}/>
                        
                            <PrivateRoute exact path="/" component={Landing}/>
                        
                        
                            <PrivateRoute exact path="/home" component={Landing}/>
                        
                        
                            <PrivateRoute exact path="/profiles/:username" component={Profile}/>
                        
                        
                            <PrivateRoute exact path="/settings/update-profile" component={ProfileUpdate}/>
                        
                        
                            <PrivateRoute exact path="/posts/edit/:id" component={PostEdit}/>
                        
                        
                            <PrivateRoute exact path="/posts/:id" component={PostView}/>
                        
                        
                            <PrivateRoute exact path="/search" component={PSearch}/>
                        
                            <Route exact path="/not-found" component={NoMatch} />
                            <Route path="*" component={NoMatch}/>
                        </Switch>
                        </Suspense>
                    </ModalProvider>
                    <VNofication/>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
