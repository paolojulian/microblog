import { combineReducers } from 'redux';
import auth from './authReducer';
import errors from './errorReducer';

export default combineReducers({
    auth,
    errors,
});