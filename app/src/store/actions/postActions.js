import axios from 'axios';
import { SET_PAGE, SET_POSTS, ADD_POSTS, TOGGLE_LOADING_POST } from '../types';

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
        dispatch({
            type: SET_PAGE,
            payload: page
        });

        return Promise.resolve(res.data.data)
    } catch (e) {
        return Promise.reject()
    } finally {
        dispatch({ type: TOGGLE_LOADING_POST, payload: false })
    }
}

/**
 * Fetches the comments of given post
 */
export const getCommentsByPost = (postId, page=1) => async dispatch => {
    try {
        const res = await axios.get(`/posts/comments/${postId}.json?page=${page}`)
        return Promise.resolve(res.data.data)
    } catch (e) {
        return Promise.reject(e)
    }
}

/**
 * Fetches the posts of username passed
 */
export const getUserPosts = (username, page = 1) => async dispatch => {
    try {
        dispatch({ type: TOGGLE_LOADING_POST, payload: true })
        const res = await axios.get(`/posts/user/${username}.json?page=${page}`)
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
        dispatch({
            type: SET_PAGE,
            payload: page
        });
        return Promise.resolve(res.data.data)
    } catch (e) {
        dispatch({
            type: SET_PAGE,
            payload: 1
        });
        return Promise.reject(e)
    } finally {
        dispatch({ type: TOGGLE_LOADING_POST, payload: false })
    }
}

/**
 * Adds a post by the current user
 */
export const addPost = (post, history) => async dispatch => {
    try {
        let config = {}
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('body', post.body);
        if (post.img) {
            config.headers = {
                'content-type': 'multipart/form-data'
            }
            formData.append('img', post.img);
        }
        await axios.post('/posts.json', formData, config)
        await dispatch(getPosts());
        return Promise.resolve()
    } catch (e) {
        return Promise.reject(e)
    }
}

/**
 * Edits a post by the current user
 */
export const editPost = (postId, post) => async dispatch => {
    try {
        let config = {}
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('body', post.body);
        if (post.img) {
            config.headers = {
                'content-type': 'multipart/form-data'
            }
            formData.append('img', post.img);
        }
        await axios.post(`/posts/edit/${postId}.json`, formData, config)
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

/**
 * Add a comment to a certain post
 */
export const addComment = (comment) => async dispatch => {
    try {
        await axios.post(`/comments.json`, comment)
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Deletes a comment
 */
export const deleteComment = (commentId) => async dispatch => {
    try {
        await axios.delete(`/comments/${commentId}.json`)
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    }
}

/**
 * Gets the likes of a post
 */
export const fetchLikesByPost = (postId) => async dispatch => {
    try {
        const res = await axios.get(`/posts/likes/${postId}.json`)
        return Promise.resolve(res.data.data);
    } catch (e) {
        return Promise.reject(e);
    }
}