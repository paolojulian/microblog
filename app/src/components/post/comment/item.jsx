import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './post-comment.module.css';

/** Components */
import PCard from '../../widgets/p-card';
import ProfileImage from '../../widgets/profile-image';

const CommentItem = ({
    id,
    body,
    userId,
    username,
    created
}) => {
    return (
        <PCard size="fit">
            <div className={styles.itemBody}>
                <div className={styles.profileImg}>
                    <ProfileImage
                        size={24}
                        src={`${userId}/${username}x24.png`}
                    />
                </div>
                <div className="username">
                    <Link to={`/profiles/${username}`}>
                        @{username}&nbsp;
                    </Link>
                </div>
                <div className={styles.bodyText}>
                    {body}
                </div>
            </div>
        </PCard>
    );
}

CommentItem.propTypes = {
    id: PropTypes.number.isRequired,
    body: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    created: PropTypes.any.isRequired,
}

CommentItem.defaultProps = {
}

export default CommentItem