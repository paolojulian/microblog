import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './landing.module.css';
import WithNavbar from '../hoc/with-navbar';

/** Redux */
import { getProfile } from '../../store/actions/profileActions'
import { getPosts } from '../../store/actions/postActions'
import { CLEAR_POSTS } from '../../store/types'

/** Components */
import PCard from '../widgets/p-card'
import ProfileCard from './profile-card'
import Posts from '../post'
import PostCreate from '../post/create'

const Landing = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProfile())
        fetchHandler();
        return () => {
            dispatch({ type: CLEAR_POSTS })
        }
    }, [])

    const fetchHandler = (n = 1) => dispatch(getPosts(n));

    return (
        <div className={styles.landing}>
            <div className={styles.profile}>
                <ProfileCard size="fit"/>
                <div className={styles.editProfile}>
                    <Link to="/settings/update-profile">
                        <PCard size="fit">
                            <i className="fa fa-gear"></i>
                            &nbsp;Edit Profile
                        </PCard>
                    </Link>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.posts}>
                    <PostCreate size="fit"/>
                    <Posts
                        fetchHandler={fetchHandler}
                    />
                </div>
                <div className={styles.suggestions}>
                    <PCard size="fit"></PCard>
                </div>
            </div>
        </div>
    )
}

export default WithNavbar(Landing)