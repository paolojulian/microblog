import React, { useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './v-notification.module.css'

/** Redux */
import {
    countUnreadNotifications,
    readNotification,
    addNotificationCount,

    addPopupNotifications,
    removePopupNotifications,

} from '../../../store/actions/notificationActions';
import VNotificationItem from './v-notification-item';

let websocket;
const VNotification = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { popupNotifications } = useSelector(state => state.notification);
    const notificationContainer = createRef();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(countUnreadNotifications());
            connectWebSocket(user.id);
            return;
        }
        closeWebsocket();
    }, [isAuthenticated])

    const connectWebSocket = (userId) => {
        let websocket = null;
        if (process.env.NODE_ENV === 'production') {
            websocket = new WebSocket(`ws://dev1.ynsdev.pw:4567?id=${userId}`);
        } else {
            console.log(process.env);
            websocket = new WebSocket(`ws://127.0.0.1:4567?id=${userId}`);
        }
        websocket.onopen = e => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Connected');
            }
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
            if (process.env.NODE_ENV !== 'production') {
                console.log('Disconnect');
            }
            websocket.close();
        };
    }

    const closeWebsocket = () => {
        if (websocket) {
            websocket.onclose = () => {}
            websocket.close();
        }
    }
    
    const showNotification = (data) => {
        dispatch(addPopupNotifications(data))
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
       dispatch(removePopupNotifications(index));
    }

    return (
        <div className={styles.wrapper}
            ref={notificationContainer}
        >
            {popupNotifications.map((notification, i) => {
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
                                showCloseBtn={true}
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