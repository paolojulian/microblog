import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './profile-card.module.css';

/** Components */
import PCard from '../widgets/p-card';
import PFollowing from '../widgets/p-following';
import PLoader from '../widgets/p-loader';
import ProfileImage from '../widgets/profile-image';

const ProfileCard = (props) => {
    const { user, loading } = useSelector(state => state.profile);
    const { totalFollowers, totalFollowing } = useSelector(state => state.profile)


    const renderBody = () => (
        <div className={styles.profile_card}>
            <div className={styles.profile_img}>
                <ProfileImage
                    src={user.avatar_url}
                    alt={user.username}
                />
                <div className={styles.credentials}>
                    <div className={styles.last_name}>
                        <Link to={`/profiles/${user.username}`}>
                            {user.last_name}
                        </Link>
                    </div>
                    <div className={styles.first_name}>
                        {user.first_name}
                    </div>
                    <div className="username">
                        <Link to={`/profiles/${user.username}`}>
                            @{user.username}
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.info}>
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
