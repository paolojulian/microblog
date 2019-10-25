import { SET_POSTS } from '../types';

const initialState = []

export default (state = initialState, action) => {

    switch (action.type) {
        case SET_POSTS:
            return [
                ...state,
                ...action.payload
            ]
        default:
            return state;
    }

}