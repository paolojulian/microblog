import axios from 'axios';
import { SET_POSTS } from '../types';

// Login user
export const addPost = (post) => async dispatch => {
    try {
        await axios.post('/posts.json', post)
        fetchPosts();
        return Promise.resolve()
    } catch (e) {
        return Promise.reject()
    }

}

export const fetchPosts = () => dispatch => {
    // Loading
    dispatch({
        type: SET_POSTS,
        payload: []
    })
}