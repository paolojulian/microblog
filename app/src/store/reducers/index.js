import { combineReducers } from 'redux';
import auth from './authReducer';
import errors from './errorReducer';
import profile from './profileReducer';
import post from './postReducer';
import notification from './notificationReducer';

export default combineReducers({
    auth,
    errors,
    profile,
    post,
    notification
});