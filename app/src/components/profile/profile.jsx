import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from './profile.module.css'

/** Redux */
import { CLEAR_POSTS } from '../../store/types'
import { getProfile } from '../../store/actions/profileActions'
import { getUserPosts } from '../../store/actions/postActions'

/** Components */
import { withRouter } from 'react-router-dom'
import WithNavbar from '../hoc/with-navbar'
import ProfileInfo from './info'
import Post from '../post'

const Profile = (props) => {
    const { username } = props.match.params;
    const dispatch = useDispatch();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const init = async () => {
            const res = await dispatch(getProfile(username))
            if ( ! res.user) {
                return props.history.push('/not-found')
            }
            await dispatch(getUserPosts(username))
            setIsMounted(true);
        }
        init();
        return () => {
            dispatch({ type: CLEAR_POSTS })
        };
    }, [])

    const fetchHandler = (page = 1) => dispatch(getUserPosts(username, page))

    return isMounted ? (
        <div className={styles.profile_wrapper}>
            <ProfileInfo/>
            <div className={styles.posts}>
                <Post fetchHandler={fetchHandler}/>
            </div>
        </div>
    ) : (
        <div>Loading</div>
    )
}

export default withRouter(WithNavbar(Profile))