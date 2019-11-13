import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './notification-bell.module.css';

/** Redux */
import {
    fetchUnreadNotifications,
    readNotification,
    readAllNotification,
    clearNotification,
    addNotificationCount
} from '../../../store/actions/notificationActions';

/** Components */
import PLoader from '../../widgets/p-loader';

const initialStatus = {
    loading: false,
    error: false,
    post: false
}

const NotificationItem = ({ id, message, onRead }) => (
    <div className={styles.item}
        onClick={() => onRead(id)}
        dangerouslySetInnerHTML={{__html: message}}
    >
    </div>
)

const Notifications = ({ status, notifications, onRead, onReadAll }) => {
    if (status.error) {
        return <div className="disabled">Something went wrong</div>
    }
    if (status.loading) {
        return <PLoader />
    }
    if (notifications.length === 0) {
        return <div className="disabled">No notifications</div>
    }
    return (
        <div>
            {notifications.map(({Notification}) => (
                <NotificationItem
                    id={Notification.id}
                    message={Notification.message}
                    onRead={onRead}
                />
            ))}
            {notifications.length >= 2 && <div
                className="disabled"
                onClick={onReadAll}
            >
                Read All
            </div>}
        </div>
    )
}

const NotificationBell = ({ notificationCount }) => {
    const dispatch = useDispatch();
    const { notifications } = useSelector(state => state.notification);
    const [status, setStatus] = useState(initialStatus);
    // Set if notification currently displaying on screen
    const [isDisplay, setDisplay] = useState(false);

    const showNotifications = async () => {
        if (isDisplay) {
            setDisplay(false);
            return;
        }
        setDisplay(true);
        setStatus({ ...initialStatus, loading: true });
        try {
            await dispatch(fetchUnreadNotifications());
            setStatus({ ...initialStatus, post: true })
        } catch (e) {
            setStatus({ ...initialStatus, error: true })
        }
    }

    const handleOnRead = (id) => {
        dispatch(readNotification(id))
            .then(() => dispatch(addNotificationCount(-1)))
    }

    const handleOnReadAll = () => {
        dispatch(readAllNotification())
            .then(() => dispatch(clearNotification()))
    }

    return (
        <div style={{ position: 'relative' }}
            onClick={showNotifications}
        >
            <i className="fa fa-bell"/>
            {notificationCount > 0 && <span className={styles.bell}>
                {notificationCount}
            </span>}
            {isDisplay && <div className={styles.content}>
                <Notifications
                    status={status}
                    notifications={notifications}
                    onRead={handleOnRead}
                    onReadAll={handleOnReadAll}
                    />
            </div>}
        </div>
    )
}

NotificationBell.propTypes = {
    notificationCount: PropTypes.number.isRequired
}

NotificationBell.defaultProps = {
    notificationCount: 0
}

export default NotificationBell
