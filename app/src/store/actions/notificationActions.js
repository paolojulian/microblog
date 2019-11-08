import axios from 'axios';
import { NOTIFICATION } from '../types'

/**
 * Fetch the unread notifications of the user
 */
export const fetchUnreadNotifications = () => async dispatch => {
    try {
        const res = await axios.get('/notifications/unread.json');
        dispatch({
            type: NOTIFICATION.set,
            payload: res.data.data
        })
        return Promise.resolve(res.data.data);
    } catch (e) {
        return Promise.reject(e)
    }
}

/**
 * Counts the unread notifications of the user
 */
export const countUnreadNotifications = () => async dispatch => {
    try {
        const res = await axios.get('/notifications/unreadCount.json');
        dispatch({
            type: NOTIFICATION.setCount,
            payload: res.data.data
        });
        return Promise.resolve(res.data.data);
    } catch (e) {
        return Promise.reject(e)
    }
}

/**
 * Set notification as read
 */
export const readNotification = (id) => async dispatch => {
    try {
        const res = await axios.post(`/notifications/read/${id}.json`);
        return await Promise.resolve(res.data.data);
    } catch (e) {
        return await Promise.reject()
    }
}

/**
 * Adds or subtract the number of notifications unread
 */
export const addNotificationCount = (n = 1) => dispatch => {
    dispatch({
        type: NOTIFICATION.addCount,
        payload: n
    })
}