import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './landing.module.css';
import WithNavbar from '../hoc/with-navbar';

/** Redux */
import { getProfile, fetchNotFollowed } from '../../store/actions/profileActions';
import { getPosts } from '../../store/actions/postActions';
import { CLEAR_POSTS } from '../../store/types';

/** Components */
import PCard from '../widgets/p-card';
import ProfileCard from './profile-card';
import Posts from '../post';
import PeopleYouMayKnow from './people-you-may-know';
import PostCreate from '../post/create';
import LandingLoading from './landing-loading';

const Landing = () => {
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(true);
    const { refreshToken } = useSelector(state => state.refresh);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
        const init = async () => {
            setLoading(true);
            await dispatch(getProfile());
            await fetchHandler();
            await dispatch(fetchNotFollowed());
            setLoading(false);
        }
        init();
        return () => {
            dispatch({ type: CLEAR_POSTS })
        }
    }, [refreshToken])

    const fetchHandler = (page = 1) => dispatch(getPosts(page));

    if (isLoading) {
        return <LandingLoading/>
    }

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
                    <Posts fetchHandler={fetchHandler}/>
                </div>
            </div>
            <div className={styles.right}>
                <PeopleYouMayKnow />
            </div>
        </div>
    )
}

export default WithNavbar(Landing)