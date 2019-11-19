import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './profile.module.css'

/** Redux */
import { CLEAR_POSTS } from '../../store/types'
import { getProfile, fetchMutualFriends } from '../../store/actions/profileActions'
import { getUserPosts } from '../../store/actions/postActions'

/** Components */
import { withRouter } from 'react-router-dom'
import WithNavbar from '../hoc/with-navbar'
import ProfileInfo from './info'
import PCard from '../widgets/p-card'
import Post from '../post'
import UserItem from '../widgets/user'
import PLoader from '../widgets/p-loader'

const Header = () => (
    <div style={{
        fontSize: '1rem',
        fontStyle: 'italic',
        fontWeight: '400',
    }}>
        Also followed by 
    </div>
)

const MutualFriends = ({ mutualFriends }) => (
    <div className={styles.mutual}>
        <PCard size="fit"
            header={<Header />}
        >
            {mutualFriends.length === 0 && <div className="disabled">
                None
            </div>}
            {mutualFriends.length > 0 && mutualFriends.map(({ User }, i) => (
                <UserItem key={i} user={User} showFollow={false}/>
            ))}
        </PCard>
    </div>
)

const Profile = (props) => {
    const { username } = props.match.params;
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isMounted, setIsMounted] = useState(false);
    const [mutualFriends, setMutualFriends] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await dispatch(getProfile(username))
                setMutualFriends([]);
                if ( ! res.user) {
                    throw new Error('Not found');
                }
                await dispatch(getUserPosts(username))
                if (user.username !== username) {
                    const mutual = await dispatch(fetchMutualFriends(username));
                    setMutualFriends(mutual);
                }
                setIsMounted(true);
            } catch (e) {
                return props.history.push('/not-found')
            }
        }
        init();
        return () => {
            dispatch({ type: CLEAR_POSTS })
        };
    }, [props.match.params])

    const fetchHandler = (page = 1) => dispatch(getUserPosts(username, page))

    if ( ! isMounted) {
        return <PLoader />
    }

    return (
        <div className={styles.profile_wrapper}>
            <ProfileInfo/>
            <div className={styles.info}>
                {user.username !== username
                    ? <MutualFriends mutualFriends={mutualFriends}/>
                    : <div className={styles.editProfile}>
                        <Link to="/settings/update-profile">
                            <PCard size="fit">
                                <i className="fa fa-gear"></i>
                                &nbsp;Edit Profile
                            </PCard>
                        </Link>
                    </div>}
                <div className={styles.posts}>
                    <Post fetchHandler={fetchHandler}/>
                </div>
            </div>
        </div>
    )
}

export default withRouter(WithNavbar(Profile))