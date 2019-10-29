import { SET_PROFILE, CLEAR_CURRENT_PROFILE, TOGGLE_LOADING_PROFILE } from '../types';

const initialState = {
    loading: true
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
        case CLEAR_CURRENT_PROFILE:
            return initialState
        default:
            return state;
    }

}