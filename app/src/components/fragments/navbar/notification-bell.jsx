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
import NotificationModal from '../../notifications/index';

/** Consumer */
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context';

const initialStatus = {
    loading: false,
    error: false,
    post: false
}

const Notifications = ({
    status,
    notifications,
    notificationCount,
    onRead,
    onReadAll
}) => {
    if (status.error) {
        return <div className="disabled italic">Something went wrong</div>
    }
    if (status.loading) {
        return <PLoader />
    }
    if (notifications.length === 0) {
        return <div className="disabled italic">No new notification/s</div>
    }
    return (
        <div className={styles.notificationWrapper}>
            {notifications.length > 0 && <div
                className={"disabled " + styles.readAll}
            >
                <span onClick={onReadAll}>Read All</span>
            </div>}
            {notifications.map(({Notification, User}, i) => (
               <div className={styles.item} key={i}>
                    <VNotificationItem
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
            {notificationCount > 3 && <ModalConsumer>
                {({ showModal }) => (
                    <div
                        className={`disabled ${styles.viewMore}`}
                        onClick={() => showModal(NotificationModal)}
                    >
                        View more ({notificationCount - 3})
                    </div>
                )}
            </ModalConsumer>}
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
                    notificationCount={notificationCount}
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
