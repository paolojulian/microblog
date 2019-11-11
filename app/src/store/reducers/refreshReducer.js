import { REFRESH } from '../types';

const initialState = {
    refreshToken: 1
}

export default (state = initialState, action) => {

    switch (action.type) {
        case REFRESH:
            return {
                ...state,
                refreshToken: state.refreshToken + 1
            }
        default:
            return state;
    }

}