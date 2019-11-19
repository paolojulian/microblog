import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './post-item.module.css';

/** Components */
import PostHeader from '../header';

const SharedPost = ({
    postId,
    userId,
    originalUserId,
    body,
    avatarUrl,
    username,
    created
}) => {

    const SharedItem = () => (
        <div style={{ lineHeight: '0.75rem' }}>
            shared&nbsp;
            {userId === originalUserId ? 'own': 'a'}&nbsp;
            <Link to={`/posts/${postId}`}>
                <span className="username">post</span>
            </Link>
        </div>
    );

    return (
        <div className={styles.sharedPost}>
            <PostHeader
                postId={postId}
                hasTitle={false}
                message={SharedItem()}
                username={username}
                avatarUrl={avatarUrl}
                created={created}
            />
            <div className={styles.sharedPostBody}>
                {body}
            </div>
        </div>
    )
}

SharedPost.propTypes = {
    userId: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    originalUserId: PropTypes.number.isRequired,
    body: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
}

export default SharedPost
