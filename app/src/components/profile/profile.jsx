import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styles from './profile.module.css'

/** Redux */
import { CLEAR_POSTS } from '../../store/types'
import { getProfile } from '../../store/actions/profileActions'
import { getUserPosts } from '../../store/actions/postActions'

/** Components */
import WithNavbar from '../hoc/with-navbar'
import ProfileInfo from './info'
import Post from '../post'

const Profile = (props) => {
    const { username } = props.match.params;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProfile())
        dispatch(getUserPosts(username))
        return () => {
            dispatch({ type: CLEAR_POSTS })
        };
    }, [])

    const fetchHandler = () => {
        dispatch(getUserPosts(username))
    }

    return (
        <div className={styles.profile_wrapper}>
            <ProfileInfo/>
            <div className={styles.posts}>
                <Post
                    fetchHandler={fetchHandler}
                />
            </div>
        </div>
    )
}

export default WithNavbar(Profile)