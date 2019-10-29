import React, { useEffect, createRef } from 'react'
import { useSelector } from 'react-redux'
import styles from './v-notification.module.css'

const VNotification = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const notificationContainer = createRef();

    useEffect(() => {
        if (isAuthenticated) {
            connectWebSocket(user.id);
        }
        return () => {
        };
    }, [isAuthenticated])

    const connectWebSocket = (userId) => {
        let websocket = new WebSocket(`ws://127.0.0.1:8080/notifications?id=${userId}`);
        websocket.onopen = e => {
            console.log('Connected');
        }
        websocket.onmessage = e => {
            showNotification(e.data)
        }
        websocket.onclose = (e) => {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(() => {
                connectWebSocket(userId);
            }, 1000);
        };
        websocket.onerror = (err) => {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            this.websocket.close();
        };
    }
    
    const showNotification = (message) => {
        /** Add webcomponents, located in webroot/js/v-notifier.js */
        let notif = document.createElement('v-notifier')
        notificationContainer.appendChild(notif);
        notif.message = message;
    }

    return (
        <div className={styles.notification}
            ref={notificationContainer}
        >
        </div>
    )
}

export default VNotification