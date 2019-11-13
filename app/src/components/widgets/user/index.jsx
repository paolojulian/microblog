import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styles from './user-item.module.css';

/** Redux */
import { followUser } from '../../../store/actions/profileActions';

/** Components */
import ProfileImage from '../profile-image/profile-image';
import Username from '../username';

const UserItem = ({ user, showFollow, onRequestClose }) => {
    const dispatch = useDispatch();
    const [isFollowing, setFollowing] = useState(!!user.is_following);

    const handleFollow = (id) => {
        dispatch(followUser(id))
            .then(() => setFollowing(true))
    }

    return (
        <Link to={`/profiles/${user.username}`}>
            <div className={"User " + styles.user}>
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
                        <Username
                            username={user.username} 
                            onClick={onRequestClose}
                           />
                    </div>
                </div>
                {showFollow && ! isFollowing && <div className={styles.follow}
                    onClick={() => handleFollow(user.id)}
                >
                    <i className="fa fa-heart"></i>
                </div>}
            </div>
        </Link>
    )
};

UserItem.propTypes = {
    user: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired
}

UserItem.defaultProps = {
    showFollow: true,
    onRequestClose: () => {}
}

export default UserItem;