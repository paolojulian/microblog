import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './index.module.css';

/** Components */
import PostTitle from '../title';
import ProfileImage from '../../widgets/profile-image/profile-image';
import Username from '../../widgets/username';

const fromNow = date => {
    return moment(date).fromNow()
}
const PostHeader = ({
    postId,
    hasTitle,
    title,
    message,
    username,
    avatarUrl,
    created
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <ProfileImage
                    src={avatarUrl}
                    size={32}
                />
                <div className={styles.creatorInfo}>
                    <Username username={username}/>
                    &nbsp;
                    &#8226;
                    &nbsp;
                    <span className={styles.time}>
                        {fromNow(created)}
                    </span>
                    {message}
                </div>
            </div>
            {hasTitle && <PostTitle
                postId={postId}
                title={title}
            />}
        </div>
    )
}

PostHeader.propTypes = {
    postId: PropTypes.number.isRequired,
    hasTitle: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.any,
    username: PropTypes.any,
    avatarUrl: PropTypes.any,
    created: PropTypes.any
}

PostHeader.defaultProps = {
    hasTitle: true,
    title: '',
    message: ''
}

export default PostHeader
