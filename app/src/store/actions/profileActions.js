import axios from 'axios';
import { SET_PROFILE } from '../types';

// Get profile of current user
export const getProfile = () => async dispatch => {
    const res = await axios.get('/profiles/current.json')
    dispatch({
        type: SET_PROFILE,
        payload: res.data.data
    })
}