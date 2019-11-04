import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styles from './p-follow.module.css';
import { Link } from 'react-router-dom';

/** Redux */
import { fetchFollow } from '../../../store/actions/profileActions';
import { followUser } from '../../../store/actions/profileActions';

/** Components */
import PModal from '../../widgets/p-modal';
import PLoader from '../../widgets/p-loader';
import ProfileImage from '../profile-image/profile-image';

const availableTypes = ['follower', 'following'];
const PFollowModal = ({
    userId,
    type,
    onRequestClose,
}) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [users, setUsers] = useState([]);

    if (availableTypes.indexOf(type) === -1) {
        console.log('Invalid Type Given: ' + type);
        return onRequestClose();
    }

    useEffect(() => {
        const init = async () => {
            try {
                const users = await dispatch(fetchFollow(userId, type));
                setUsers(users);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [])

    const handleFollow = (id, itemIndex) => {
        dispatch(followUser(id))
            .then(() => {
                let objectName = type === 'follower' ? 'User' : 'Following';
                let usersHold = [...users];
                usersHold[itemIndex][objectName]['is_following'] = true;
                setUsers(usersHold);
            })
    }

    const renderBody = () => {
        if (users.length === 0) return <div className="disabled">No User/s</div>
        return users.map((item, i) => {
            let user = type === 'follower' ? item.User : item.Following;
            return (
                <div key={user.id}
                    className={styles.user}
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
                    { ! user.is_following && <div className={styles.follow}
                        onClick={() => handleFollow(user.id, i)}
                    >
                        <i className="fa fa-heart"></i>
                    </div>}
                </div>
            );
        })
    }

    return (
        <PModal onRequestClose={onRequestClose}
            header={type === 'follower' ? 'Followers': 'Following'}
        >
            {isLoading ? <PLoader /> : renderBody()}
        </PModal>
    )
};

PFollowModal.propTypes = {
    userId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
}

export default PFollowModal;