import { SET_PAGE, SET_POSTS, ADD_POSTS, CLEAR_POSTS, TOGGLE_LOADING_POST } from '../types';

const initialState = {
    isLoading: false,
    page: 1,
    list: []
}

export default (state = initialState, action) => {

    switch (action.type) {
        case SET_PAGE:
            return {
                ...state,
                page: Number(action.payload)
            }
        case SET_POSTS:
            return {
                ...state.isLoading,
                list: [...action.payload]
            }
        case ADD_POSTS:
            return {
                ...state,
                list: [
                    ...state.list,
                    ...action.payload
                ]
            }
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