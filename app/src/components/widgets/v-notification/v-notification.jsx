import React, { useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './v-notification.module.css'

/** Redux */
import {
    countUnreadNotifications,
    readNotification,
    addNotificationCount
} from '../../../store/actions/notificationActions';

const VNotification = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const notificationContainer = createRef();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(countUnreadNotifications());
            connectWebSocket(user.id);
        }
    }, [isAuthenticated])

    const connectWebSocket = (userId) => {
        let websocket = new WebSocket(`ws://127.0.0.1:4567?id=${userId}`);
        websocket.onopen = e => {
            console.log('Connected');
        }
        websocket.onmessage = e => {
            const { notificationId, message } =JSON.parse(e.data);
            showNotification(notificationId, message);
        }
        websocket.onclose = (e) => {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(() => {
                connectWebSocket(userId);
            }, 10000);
        };
        websocket.onerror = (err) => {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            websocket.close();
        };
    }
    
    const showNotification = (notificationId, message) => {
        /** Add webcomponents, located in webroot/js/v-notifier.js */
        let notif = document.createElement('v-notifier')
        notificationContainer.current.appendChild(notif);
        // Add notif count on message pop
        dispatch(addNotificationCount())
        notif.addEventListener('click', () => {
            // If clicked, it will set notification as read
            dispatch(readNotification(notificationId))
            // Reduce notif count
            dispatch(addNotificationCount(-1))
        });
        notif.message = message;
    }

    return (
        <div className={styles.wrapper}
            ref={notificationContainer}
        >
        </div>
    )
}

export default VNotification