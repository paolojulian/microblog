import { countUnreadNotifications } from './notificationActions';
import { REFRESH } from '../types';

export const refreshHome = () => dispatch => {
    dispatch(countUnreadNotifications());
    dispatch({ type: REFRESH })
}