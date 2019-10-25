import React, { useEffect } from 'react'
import styles from './landing.module.css'
import { useDispatch } from 'react-redux'
import WithNavbar from '../hoc/with-navbar';

/** Redux actions */
import { getProfile } from '../../store/actions/profileActions'

/** Components */
import PCard from '../widgets/p-card'
import ProfileCard from './profile-card'
import PostCreate from '../post/create'

const Landing = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProfile())
    }, [])

    return (
        <div className={styles.landing}>
            <div className={styles.profile}>
                <ProfileCard size="fit"/>
            </div>
            <div className={styles.posts}>
                <PostCreate size="fit"/>
                <Posts></Posts>
            </div>
            <div className={styles.right}>
                <PCard size="fit"></PCard>
            </div>
        </div>
    )
}

export default WithNavbar(Landing)