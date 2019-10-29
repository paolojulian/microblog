import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './profile-info.module.css';

/** Redux */
import { followUser } from '../../../store/actions/profileActions';

/** Components */
import PCard from '../../widgets/p-card';
import ProfileImage from '../../widgets/profile-image';
import PLoader from '../../widgets/p-loader';

const ProfileInfo = () => {
    const dispatch = useDispatch();
    const { user: profile, loading } = useSelector(state => state.profile)
    const { id } = useSelector(state => state.auth.user)

    const handleFollow = () => {
        dispatch(followUser(profile.id))
    }

    const renderBody = () => (
        <div className={styles.wrapper}>
            <div className={styles.profileDetails}>
                {Number(id) !== Number(profile.id) && <button type="button"
                    onClick={handleFollow}
                >
                    Follow
                </button>}
            </div>
            <div className={styles.profileCredentials}>
                <div className={styles.lastName}>
                    {profile.last_name}
                </div>
                <div className={styles.firstName}>
                    {profile.first_name}
                </div>
                <div className={styles.email}>
                    {profile.email}
                </div>
                <div className={styles.username}>
                    @{profile.username}
                </div>
            </div>
            <div className={styles.profileImage}>
                <ProfileImage
                    src={`/app/webroot/img/profiles/${profile.id}/${profile.username}x128.png`}
                    alt={profile.username}
                />
            </div>
        </div>
    )

    return (
        <div className={styles.profileInfo}>
            <PCard size="lg">
                {loading ? <PLoader/>: renderBody()}
            </PCard>
        </div>
    )
}

export default ProfileInfo