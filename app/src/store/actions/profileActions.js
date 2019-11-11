import axios from 'axios';
import { search } from '../../utils/search';
import { SET_NOT_FOLLOWED, SET_PROFILE, TOGGLE_LOADING_PROFILE } from '../types';

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
        return Promise.reject(e)
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

/**
 * Uploads the image of the current user logged in
 * @param searchText - text to use for matching the desired user
 */
export const searchUser = (searchText) => async dispatch => {
    try {
        const data = await search(`/users/search/${searchText}.json`);
        return Promise.resolve(data);
    } catch (e) {
        return Promise.reject();
    }
}

/**
 * Fetch the followers or followed users
 * @param userId - user followers/followed to be seen
 * @param type - [follower/following] only
 */
export const fetchFollow = (userId, type, page = 1) => async dispatch => {
    try {
        const res = await axios.get(`/followers.json`, {
            params: {userId, type, page}
        });
        return Promise.resolve(res.data.data);
    } catch (e) {
        return Promise.reject(e);
    }
}

/**
 * Fetch the users who have not yet followed
 * prioritize the ones who have mutual connections
 */
export const fetchNotFollowed = (page = 1) => async dispatch => {
    try {
        const res = await axios.get(`/users/notfollowed.json?page=${page}`);
        dispatch({
            type: SET_NOT_FOLLOWED,
            payload: res.data.data
        });
        return Promise.resolve(res.data.data);
    } catch (e) {
        return Promise.reject(e);
    }
}

/**
 * Fetch the mutual friends with the given user
 * @param username - user to check mutual friends
 */
export const fetchMutualFriends = (username) => async dispatch => {
    try {
        const res = await axios.get(`/users/mutual/${username}.json`);
        return Promise.resolve(res.data.data);
    } catch (e) {
        return Promise.reject(e);
    }
}