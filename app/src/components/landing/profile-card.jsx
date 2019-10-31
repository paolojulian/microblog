import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './profile-card.module.css';

/** Redux */
import { getProfile } from '../../store/actions/profileActions';

/** Components */
import PCard from '../widgets/p-card';
import PFollowing from '../widgets/p-following';
import PLoader from '../widgets/p-loader';
import ProfileImage from '../widgets/profile-image';

const ProfileCard = (props) => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.profile);
    const { totalFollowers, totalFollowing } = useSelector(state => state.profile)

    useEffect(() => {
        dispatch(getProfile())
    }, []);

    const renderBody = () => (
        <div className={styles.profile_card}>
            <div className={styles.profile_img}>
                <ProfileImage
                    src={user.avatar_url}
                    alt={user.username}
                />
            </div>
            <div className={styles.info}>
                <div className={styles.last_name}>
                    <Link to={`/profiles/${user.username}`}>
                        {user.last_name}
                    </Link>
                </div>
                <div className={styles.first_name}>
                    {user.first_name}
                </div>
                <div className={styles.username}>
                    <Link to={`/profiles/${user.username}`}>
                        @{user.username}
                    </Link>
                </div>
                <PFollowing
                    userId={Number(user.id)}
                    totalFollowers={totalFollowers}
                    totalFollowing={totalFollowing}
                />
            </div>
        </div>
    )

    return (
        <PCard {...props}>
            { loading ? <PLoader/> : renderBody() }
        </PCard>
    )
}

export default ProfileCard
