import axios from 'axios';
import { SET_PROFILE, TOGGLE_LOADING_PROFILE } from '../types';

// Get profile of current user
export const getProfile = () => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_PROFILE })
        const res = await axios.get('/profiles/current.json')
        dispatch({
            type: SET_PROFILE,
            payload: res.data.data
        })
        return Promise.resolve(res.data.data)
    } catch (e) {
        return Promise.reject()
    }
}