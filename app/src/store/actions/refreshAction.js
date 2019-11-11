import { REFRESH } from '../types';

export const refreshHome = () => dispatch => {
    dispatch({ type: REFRESH })
}