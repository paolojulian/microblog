import { SET_PAGE, SET_POSTS, ADD_POSTS, CLEAR_POSTS, TOGGLE_LOADING_POST } from '../types';

const initialState = {
    isLoading: false,
    page: 1,
    list: [],
    postIds: []
}

export default (state = initialState, action) => {

    /**
     * Removes duplicate post
     * sometimes pagination generates duplicate
     * data when another post is created
     */
    const addUniquePosts = (posts) => {
        let uniquePosts = [];
        let newPostIds = [];
        for (let i = 0; i < posts.length; i ++) {
            const newPostId = posts[i].Post.id;
            if (state.postIds.indexOf(newPostId) === -1) {
                newPostIds.push(newPostId);
                uniquePosts.push(posts[i]);
            }
        }
        return {
            ...state,
            postIds: [
                ...state.postIds,
                ...newPostIds
            ],
            list: [
                ...state.list,
                ...uniquePosts
            ]
        }
    }

    const setPosts = (posts) => {
        let postIds = [];
        for (let i = 0; i < posts.length; i++) {
            postIds.push(posts[i].Post.id);
        }

        return {
            ...state,
            postIds: [...postIds],
            list: [...action.payload]
        }
    }

    switch (action.type) {
        case SET_PAGE:
            return {
                ...state,
                page: Number(action.payload)
            }
        case SET_POSTS:
            return setPosts(action.payload);
        case ADD_POSTS:
            return addUniquePosts(action.payload);
        case TOGGLE_LOADING_POST:
            return {
                ...state,
                isLoading: action.payload
            }
        case CLEAR_POSTS:
            return initialState
        default:
            return state;
    }
}