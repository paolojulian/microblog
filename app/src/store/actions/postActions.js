import axios from 'axios';
import { SET_POSTS, ADD_POSTS, TOGGLE_LOADING_POST } from '../types';

/**
 * Fetches a post by id
 */
export const getPostById = (postId) => async dispatch => {
    try {
        const res = await axios.get(`/posts/${postId}.json`)
        return Promise.resolve(res.data.data)
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Fetches the posts to display on main page
 */
export const getPosts = (page = 1) => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_POST, payload: true })
        const res = await axios.get(`/posts.json?page=${page}`)
        // Will override all posts
        if (page === 1) {
            dispatch({
                type: SET_POSTS,
                payload: res.data.data
            })
        // Add additional posts (vertical pagination)
        } else {
            dispatch({
                type: ADD_POSTS,
                payload: res.data.data
            })
        }
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    } finally {
        dispatch({ type: TOGGLE_LOADING_POST, payload: false })
    }
}

/**
 * Fetches the posts of username passed
 */
export const getUserPosts = (username, page = 1) => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_POST, payload: true })
        const res = await axios.get(`/posts/user/${username}.json`)
        // Will override all posts
        if (page === 1) {
            dispatch({
                type: SET_POSTS,
                payload: res.data.data
            })
        // Add additional posts (vertical pagination)
        } else {
            dispatch({
                type: ADD_POSTS,
                payload: res.data.data
            })
        }
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    } finally {
        dispatch({ type: TOGGLE_LOADING_POST, payload: false })
    }
}

/**
 * Adds a post by the current user
 */
export const addPost = (post) => async dispatch => {
    try {
        await axios.post('/posts.json', post)
        await dispatch(getPosts());
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Edits a post by the current user
 */
export const editPost = (postId, post) => async dispatch => {
    try {
        await axios.put(`/posts/${postId}.json`, post)
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Deletes a post of the current user
 */
export const deletePost = (postId) => async dispatch => {
    try {
        await axios.delete(`/posts/${postId}.json`)
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Shares a post by another user
 */
export const sharePost = (postId) => async dispatch => {
    try {
        await axios.post(`/posts/share/${postId}.json`)
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Likes a post
 */
export const likePost = (postId) => async dispatch => {
    try {
        await axios.post(`/posts/like/${postId}.json`)
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    }
}