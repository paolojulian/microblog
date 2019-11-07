import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './user-item.module.css';

/** Redux */
import { followUser } from '../../../store/actions/profileActions';

/** Components */
import ProfileImage from '../profile-image/profile-image';

const UserItem = ({ user, showFollow, onRequestClose }) => {
    const dispatch = useDispatch();
    const [isFollowing, setFollowing] = useState(!!user.is_following);

    const handleFollow = (id) => {
        dispatch(followUser(id))
            .then(() => setFollowing(true))
    }

    return (
            <div key={user.id}
                className={"User " + styles.user}
            >
                <div className={styles.avatar}>
                    <ProfileImage
                        src={user.avatar_url}
                        size={32}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.name}>
                        {user.first_name + ' ' + user.last_name}
                    </div>
                    <div className="username">
                        <Link to={`/profiles/${user.username}`}
                            onClick={onRequestClose}
                        >
                            @{user.username}
                        </Link>
                    </div>
                </div>
                {showFollow && ! isFollowing && <div className={styles.follow}
                    onClick={() => handleFollow(user.id)}
                >
                    <i className="fa fa-heart"></i>
                </div>}
            </div>
    )
};

UserItem.propTypes = {
    user: PropTypes.object.isRequired
}

UserItem.defaultProps = {
    showFollow: true
}

export default UserItem;