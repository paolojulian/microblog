import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from './notifications.module.css';

/** Redux */
import {
    fetchUnreadNotifications,
    readNotification,
    addNotificationCount,
    countUnreadNotifications
} from '../../store/actions/notificationActions';

/** Utils */
import InitialStatus from '../utils/initial-status';
import Pager from '../utils/pager';

/** Components */
import PModal from '../widgets/p-modal';
import VNotificationItem from '../widgets/v-notification/v-notification-item';
import NotificationLoading, { NotificationMock } from './loader';

const EmptyNotifications = () => (
    <div className="disabled">No new notification/s</div>
)

const Notifications = ({
    onRequestClose
}) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(InitialStatus);
    const { notifications, notificationCount } = useSelector(state => state.notification);
    const [pager, setPager] = useState(Pager);
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await handleFetch();
                setMounted(true);
            } catch (e) {
                setStatus({ ...InitialStatus.ERROR });
            }
        }
        init();
        // TODO Add if mounted cancel all setters
    }, [])

    /**
     * Handles the fetching of the data to be displayed
     */
    const handleFetch = async(pageNo = 1) => {
        try {
            setStatus({ ...InitialStatus.LOADING });
            const notifications = await dispatch(fetchUnreadNotifications(pageNo, 10));
            await dispatch(countUnreadNotifications());
            setPager({ ...pager,
                page: pageNo,
                more: notificationCount - notifications.length
            });
            setStatus({ ...InitialStatus.POST });
            return Promise.resolve(notifications);
        } catch (e) {
            setStatus({ ...InitialStatus.ERROR });
            return Promise.reject(e);
        }
    }

    const handleOnRead = (id) => {
        onRequestClose();
        dispatch(readNotification(id))
            .then(() => dispatch(addNotificationCount(-1)))
    }

    const renderNotifications = notifications.map(({ Notification, User }, i) => (
        <div className={styles.item} key={`vnotificationitem_${i}`}>
            <VNotificationItem
                key={`notificationItem_${i}`}
                index={i}
                notificationId={Notification.id}
                type={Notification.type}
                postId={Notification.post_id}
                username={User.username}
                avatarUrl={User.avatar_url}
                onRead={handleOnRead}
                />
        </div>
    ))

    if (status.error) {
        return (
            <PModal
                onRequestClose={onRequestClose}
                header="Notifications"
            >
                <div className="disabled">Oops. Something went wrong</div>
            </PModal>
        );
    }

    if ( ! isMounted) {
        return (
            <PModal
                onRequestClose={onRequestClose}
                header="Notifications"
            >
                <NotificationLoading />
            </PModal>
        );
    }

    return (
        <PModal
            enableScrollPaginate={true}
            pager={pager}
            onScrollPaginate={handleFetch}
            onRequestClose={onRequestClose}
            header="Notifications"
        >
            {notifications.length === 0 ? <EmptyNotifications /> : renderNotifications}
        </PModal>
    );
}

export default withRouter(Notifications);