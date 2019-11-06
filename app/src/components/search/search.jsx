import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import styles from './search.module.css'
import { useDispatch } from 'react-redux'

/** Redux */
import { apiSearch, apiSearchUsers, apiSearchPosts } from '../../store/actions/searchActions'

/** Components */
import { withRouter } from 'react-router-dom'
import WithNavbar from '../hoc/with-navbar'
import SearchLoader from './search-loader'
import SearchBar from './search-bar'
import SearchUsers from './search-users'
import SearchPosts from './search-posts'

const initialStatus = {
    loading: false,
    error: false,
    post: false
}

const initialPager = {
    loading: false,
    page: 1,
    totalLeft: 0
}

const PSearch = (props) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState({ ...initialStatus })
    const [searchText, setSearchText] = useState(queryString.parse(props.location.search).searchText);
    const [users, setUsers] = useState([]);
    const [userPager, setUserPager] = useState(initialPager);
    const [posts, setPosts] = useState([]);
    const [postPager, setPostPager] = useState(initialPager);

    useEffect(() => {
        const init = async () => {
            setStatus({ ...initialStatus, loading: true });
            try {
                await searchUsersAndPosts(searchText)
                setStatus({ ...initialStatus, post: true });
            } catch (e) {
                setStatus({ ...initialStatus, error: true });
            }
        }
        init();
        // TODO Add if mounted cancel all setters
    }, [])

    const handleSearch = e => {
        setSearchText(e.target.value);
        searchUsersAndPosts(e.target.value);
    }

    const searchUsersAndPosts = async str => {
        const trimmedStr = str.trim();
        if ( ! trimmedStr) {
            setPosts([])
            setUsers([])
            return Promise.resolve();
        }

        try {
            const data = await dispatch(apiSearch(trimmedStr))
            if (data) {
                setUsers(data.users.list)
                setUserPager({
                    ...userPager,
                    totalLeft: data.users.totalLeft
                })
                setPosts(data.posts.list)
                setPostPager({
                    ...postPager,
                    totalLeft: data.posts.totalLeft
                })
            }
            return Promise.resolve();
        } catch (e) {
            setStatus({ ...initialStatus, error: true });
            setUsers([]);
            setPosts([]);
            return Promise.reject(e);
        }
    }

    const searchUsers = async () => {
        try {
            const res = await dispatch(apiSearchUsers(searchText, userPager.page + 1))
            if (res.list.length > 0) {
                setUsers([ ...users, ...res.list ]);
                setUserPager({
                    page: userPager.page + 1,
                    totalLeft: res.totalLeft
                })
            }
        } catch (e) {
            setStatus({ ...initialStatus, error: true });
            setUsers([]);
        }
    }

    const searchPosts = async () => {
        try {
            const res = await dispatch(apiSearchPosts(searchText, postPager.page + 1))
            if (res.list.length > 0) {
                setPosts([ ...posts, ...res.list ]);
                setPostPager({
                    page: postPager.page + 1,
                    totalLeft: res.totalLeft
                })
            }
        } catch (e) {
            setStatus({ ...initialStatus, error: true });
            setPosts([]);
        }
    }

    const renderBody = () => (
        <div className={styles.container}>
            <SearchBar
                handleSearch={handleSearch}
                searchText={searchText}
            />
            <div className={styles.wrapper}>
                <SearchUsers
                    className={styles.users}
                    onRequestLoad={searchUsers}
                    totalLeft={userPager.totalLeft}
                    users={users}
                />
                <SearchPosts
                    className={styles.posts}
                    onRequestLoad={searchPosts}
                    totalLeft={postPager.totalLeft}
                    posts={posts}
                />
            </div>
        </div>
    )

    const render = () => {
        if (status.loading) return <SearchLoader/>
        if (status.post) return renderBody()

        return <div className="disabled">Oops. Something went wrong</div>;
    }

    return render()
}

export default withRouter(WithNavbar(PSearch))