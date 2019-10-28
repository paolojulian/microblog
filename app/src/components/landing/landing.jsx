import React, { useEffect, useState } from 'react'
import styles from './landing.module.css'
import { useDispatch } from 'react-redux'
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

    useEffect(() => {
        dispatch(getProfile())
        dispatch(getPosts(page));
        return () => {
            dispatch({ type: CLEAR_POSTS })
        };
    }, [])

    const fetchHandler = () => {
        dispatch(getPosts(page));
    }

    return (
        <div className={styles.landing}>
            <div className={styles.profile}>
                <ProfileCard size="fit"/>
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