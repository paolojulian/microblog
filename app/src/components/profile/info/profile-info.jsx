import React from 'react'
import { useSelector } from 'react-redux'
import styles from './profile-info.module.css'

/** Components */
import PCard from '../../widgets/p-card'
import ProfileImage from '../../widgets/profile-image'
import PLoader from '../../widgets/p-loader'

const ProfileInfo = () => {
    const { user, loading } = useSelector(state => state.profile)

    const renderBody = () => (
        <div className={styles.wrapper}>
            <div className={styles.profileDetails}>

            </div>
            <div className={styles.profileCredentials}>
                <div className={styles.lastName}>
                    {user.last_name}
                </div>
                <div className={styles.firstName}>
                    {user.first_name}
                </div>
                <div className={styles.email}>
                    {user.email}
                </div>
                <div className={styles.username}>
                    @{user.username}
                </div>
            </div>
            <div className={styles.profileImage}>
                <ProfileImage
                    src={`/app/webroot/img/profiles/${user.id}/${user.username}x128.png`}
                    alt={user.username}
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