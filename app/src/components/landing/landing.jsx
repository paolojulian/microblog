import React, { useEffect, useState, useRef } from 'react';
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
    const [page, setPage] = useState(1)
    const container = useRef(null)
    const [isLoading, setIsLoading] = useState(false);
    const [isLast, setIsLast] = useState(false);

    useEffect(() => {
        dispatch(getProfile())
        fetchHandler();
        return () => {
            dispatch({ type: CLEAR_POSTS })
        }
    }, [])

    useEffect(() => {
        if ( ! isLast) {
            window.addEventListener('scroll', listenOnScroll);
        }
        return () => {
            window.removeEventListener('scroll', listenOnScroll);
        };
    }, [isLoading, page, isLast])

    const listenOnScroll = () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            if (isLast) return;
            if ( ! isLoading) {
                setIsLoading(true)
                fetchHandler(page + 1)
                    .then(() => setIsLoading(false));
            }
        }
    }

    const fetchHandler = async (n = 1) => {
        try {
            const res = await dispatch(getPosts(n));
            if (res.length > 0) {
                setPage(n);
            } else {
                setIsLast(true);
            }
            return Promise.resolve();
        } catch (e) {
            if (page > 1) {
                setPage(page - 1);
            }
        }
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
            <div className={styles.container}
                ref={container}
            >
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