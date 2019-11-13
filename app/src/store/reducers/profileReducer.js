import {
    SET_NOT_FOLLOWED,
    SET_PROFILE,
    CLEAR_CURRENT_PROFILE,
    TOGGLE_LOADING_PROFILE,
    ADD_FOLLOWER,
    ADD_FOLLOWING
} from '../types';

const initialState = {
    loading: true,
    isFollowing: false,
    totalFollowers: 0,
    totalFollowing: 0,
    notFollowed: []
}

export default (state = initialState, action) => {

    switch (action.type) {
        case TOGGLE_LOADING_PROFILE:
            return {
                ...state,
                loading: true
            }
        case SET_PROFILE:
            return {
                ...state,
                ...action.payload,
                loading: false
            }
        case SET_NOT_FOLLOWED:
            return {
                ...state,
                notFollowed: action.payload
            }
        case CLEAR_CURRENT_PROFILE:
            return initialState
        case ADD_FOLLOWER:
            return {
                ...state,
                totalFollowers: state.totalFollowers + action.payload
            }
        case ADD_FOLLOWING:
            return {
                ...state,
                totalFollowers: state.totalFollowing + action.payload
            }
        default:
            return state;
    }

}