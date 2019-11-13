import React, { useContext, useState, useEffect } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from './profile-info.module.css';

/** Redux */
import { followUser, addFollower } from '../../../store/actions/profileActions';

/** Context */
import { ModalContext } from '../../widgets/p-modal/p-modal-context';

/** Components */
import PCard from '../../widgets/p-card';
import ProfileImage from '../../widgets/profile-image';
import PLoader from '../../widgets/p-loader';
import PFollowing from '../../widgets/p-following';

const ProfileInfo = () => {
    const dispatch = useDispatch();
    const { user: profile, loading } = useSelector(state => state.profile)
    const { isFollowing, totalFollowers, totalFollowing } = useSelector(state => state.profile)
    const { id } = useSelector(state => state.auth.user)
    const [stateIsFollowing, setstateIsFollowing] = useState(false);
    const context = useContext(ModalContext);

    useEffect(() => {
        setstateIsFollowing(isFollowing);
    }, [isFollowing])

    const handleFollow = () => {
        dispatch(followUser(profile.id))
            .then(() => {
                setstateIsFollowing(!stateIsFollowing);
                dispatch(addFollower(stateIsFollowing ? -1: 1));
                if ( ! stateIsFollowing) {
                    context.notify.success(`You have successfully followed ${profile.username}`)
                }
            })
            .catch(() => context.notify.serverError())
    }

    const renderBody = () => (
        <div className={styles.wrapper}>

            <div className={styles.profileDetails}>
                <PFollowing
                    userId={Number(profile.id)}
                    totalFollowers={totalFollowers}
                    totalFollowing={totalFollowing}
                />
                {Number(id) !== Number(profile.id) &&
                <div className={classnames(styles.followBtn, {
                    [styles.active]: stateIsFollowing
                })}>
                    <i className="fa fa-heart fa-2x"
                        onClick={handleFollow}/>
                </div>}
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
                    src={profile.avatar_url}
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