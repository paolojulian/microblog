import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import styles from './search.module.css'
import { useDispatch } from 'react-redux'

/** Redux */
import { apiSearch } from '../../store/actions/searchActions'

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

const PSearch = (props) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState({ ...initialStatus })
    const [searchText, setSearchText] = useState(queryString.parse(props.location.search).searchText);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
        return () => {
            setMounted(false);
        };
    }, [])

    const handleSearch = e => {
        setSearchText(e.target.value);
        searchUsersAndPosts(e.target.value);
    }

    const searchUsersAndPosts = async str => {
        console.log(str);
        const trimmedStr = str.trim();
        if ( ! trimmedStr) {
            setPosts([])
            setUsers([])
            return;
        }

        try {
            const data = await dispatch(apiSearch(trimmedStr))
            if (data) {
                setUsers(data.users)
                setPosts(data.posts)
            }
            return Promise.resolve();
        } catch (e) {
            setStatus({ ...initialStatus, error: true });
            setUsers([]);
            setPosts([]);
            return Promise.reject(e);
        }
    }

    const searchUsers = async (page = 1) => {

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
                    users={users}
                />
                <SearchPosts
                    className={styles.posts}
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