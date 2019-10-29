import axios from 'axios';
import { SET_PROFILE, TOGGLE_LOADING_PROFILE } from '../types';

/**
 * Get profile of current logged in user
 */
export const getProfile = (username = '') => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_PROFILE })
        let res;
        if (username) {
            res = await axios.get(`/profiles/view/${username}.json`)
        } else {
            res = await axios.get('/profiles/current.json')
        }
        dispatch({
            type: SET_PROFILE,
            payload: res.data.data
        })
        return Promise.resolve(res.data.data)
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Updates the details of the current user logged in
 */
export const updateProfile = (data) => async dispatch => {
    try {
        const res = await axios.put('/users/edit.json', data);
        return Promise.resolve(res.data.data)
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Uploads the image of the current user logged in
 */
export const uploadProfileImg = (img) => async dispatch => {
    try {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const formData = new FormData();
        formData.append('profile_img', img);
        const res = await axios.post('/profiles/uploadimage.json', formData, config)
        return Promise.resolve(res.data.data)
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Uploads the image of the current user logged in
 * @param Number - userId user to follow
 */
export const followUser = (userId) => async dispatch => {
    try {
        const res = await axios.post(`/followers/follow/${userId}.json`);
        return Promise.resolve(res.data.data);
    } catch (e) {
        return Promise.reject();
    }
}