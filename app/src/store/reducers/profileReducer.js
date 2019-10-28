import { SET_PROFILE, CLEAR_CURRENT_PROFILE } from '../types';

const initialState = {
    loading: true
}

export default (state = initialState, action) => {

    switch (action.type) {
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