import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './profile-card.module.css'

/** Components */
import PCard from '../widgets/p-card'
import ProfileImage from '../widgets/profile-image'

const ProfileCard = (props) => {
    const { user } = useSelector(state => state.auth)
    const { totalFollowers, totalFollowing } = useSelector(state => state.profile)

    return (
        <PCard {...props}>
            <div className={styles.profile_card}>
                <div className={styles.profile_img}>
                    <ProfileImage
                        src={`/app/webroot/img/profiles/${user.id}/${user.username}x64.png`}
                        alt={user.username}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.last_name}>
                        {user.last_name}
                    </div>
                    <div className={styles.first_name}>
                        {user.first_name}
                    </div>
                    <div className={styles.username}>
                        <Link to={`/profiles/${user.username}`}>
                            @{user.username}
                        </Link>
                    </div>
                    <div className={styles.follow}>
                        <div className={styles.followers}>
                            <label>Followers: </label>
                            <Link to="/profiles/followers">
                                {totalFollowers}
                            </Link>
                        </div>
                        <div className={styles.following}>
                            <label>Following: </label>
                            <Link to="/profiles/following">
                                {totalFollowing}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PCard>
    )
}

export default ProfileCard
