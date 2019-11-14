import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './notification-bell.module.css';

/** Redux */
import {
    fetchUnreadNotifications,
    countUnreadNotifications,
    readNotification,
    readAllNotification,
    clearNotification,
    addNotificationCount
} from '../../../store/actions/notificationActions';

/** Components */
import PLoader from '../../widgets/p-loader';
import VNotificationItem from '../../widgets/v-notification/v-notification-item';

const initialStatus = {
    loading: false,
    error: false,
    post: false
}

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
        <div className={styles.notificationWrapper}>
            {notifications.map(({Notification, User}, i) => (
                <div className={styles.item}>
                    <VNotificationItem
                        key={i}
                        index={i}
                        notificationId={Notification.id}
                        type={Notification.type}
                        postId={Notification.post_id}
                        username={User.username}
                        avatarUrl={User.avatar_url}
                        onRead={onRead}
                        />
                </div>
            ))}
            {notifications.length > 0 && <div
                className={"disabled " + styles.readAll}
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
            await dispatch(countUnreadNotifications());
            setStatus({ ...initialStatus, post: true });
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
            {notificationCount > 0 && ! isDisplay && <span className={styles.bell}>
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
