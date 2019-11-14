import React from 'react';
import styles from './v-notification-item.module.css';
import { Link } from 'react-router-dom';

/** Components */
import ProfileImage from '../profile-image';
import Username from '../username';

const VNotificationItem = ({
    index,
    notificationId,
    avatarUrl,
    username,
    type,
    postId,
    onRead,
    onClose
}) => {

    let link;

    switch (type) {
        case 'followed':
            link = `/profiles/${username}`;
            break;
        case 'shared':
            // No break
        case 'liked':
            // No break
        case 'commented':
            link = `/posts/${postId}`
            break;
        default:
            link = '';
    }

    const message = () => {
        let text = '';
        switch (type) {
            case 'followed':
                text = 'has followed you';
                break;
            case 'shared':
                text = 'has shared your post';
                break;
            case 'liked':
                text = 'has liked your post';
                break;
            case 'commented':
                text = 'has commented on your post';
                break;
            default:
                return '';
        }
        return (
            <Link to={link} onClick={() => onRead(notificationId, index)}>
                {text}
            </Link>
        )
    }

    return (
        <div className={styles.body}>
            <ProfileImage
                src={avatarUrl}
                size={32}
            />
            <div className={styles.info}>
                <Link to={link}>
                    <Username username={username}
                        onClick={() => onRead(notificationId, index)}
                    />
                </Link>
                <div className={styles.message}>
                    {message()}
                </div>
            </div>
            <div className={styles.close}
                type="button"
                onClick={() => onClose(index)}
            >
                &times;
            </div>
        </div>
    )
}

export default VNotificationItem
