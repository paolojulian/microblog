import React, { useState, useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './v-notification.module.css'

/** Redux */
import {
    countUnreadNotifications,
    readNotification,
    addNotificationCount
} from '../../../store/actions/notificationActions';
import VNotificationItem from './v-notification-item';

const VNotification = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const notificationContainer = createRef();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(countUnreadNotifications());
            connectWebSocket(user.id);
        }
    }, [isAuthenticated])

    const connectWebSocket = (userId) => {
        let websocket = new WebSocket(`ws://13.250.23.187:4567?id=${userId}`);
        // let websocket = new WebSocket(`ws://127.0.0.1:4567?id=${userId}`);
        websocket.onopen = e => {
        }
        websocket.onmessage = e => {
            showNotification(JSON.parse(e.data));
        }
        websocket.onclose = (e) => {
            setTimeout(() => {
                connectWebSocket(userId);
            }, 10000);
        };
        websocket.onerror = (err) => {
            websocket.close();
        };
    }
    
    const showNotification = (data) => {
        setNotifications((old) => [...old, data]);
        // Add notif count on message pop
        dispatch(addNotificationCount())
    }
    const handleOnRead = (notificationId, index) => {
        handleOnClose(index);
        dispatch(readNotification(notificationId))
            .then(() => {
                dispatch(addNotificationCount(-1))
            });
    }

    const handleOnClose = (index) => {
        let tmpNotifications = [...notifications];
        tmpNotifications.splice(index, 1);
        setNotifications([...tmpNotifications]);
    }

    return (
        <div className={styles.wrapper}
            ref={notificationContainer}
        >
            {notifications.map((notification, i) => {
                try {
                    return (
                        <div className={styles.notification}>
                            <VNotificationItem
                                key={i}
                                index={i}
                                notificationId={notification.id}
                                type={notification.type}
                                postId={notification.postId}
                                username={notification.user.username}
                                avatarUrl={notification.user.avatar_url}
                                onRead={handleOnRead}
                                onClose={handleOnClose}
                                />
                        </div>
                    )
                } catch (e) {
                    return '';
                }
            })}
        </div>
    )
}

export default VNotification