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

    useEffect(() => {
        setStatus({ ...initialStatus, loading: true });
        let test = setTimeout(() => {
            setStatus({ ...initialStatus, post: true });
        }, 500);
        return () => {
            clearTimeout(test);
        };
    }, [])

    const handleSearch = e => {
        const str = e.target.value.trim();
        setSearchText(str);
        if ( ! str) {
            return setUsers([])
        }

        dispatch(apiSearch(str))
            .then(data => {
                // Sometimes canceling token will return undefined
                if ( ! data) return;
                setUsers(data.users)
                setPosts(data.posts)
            })
            .catch(() => {
                setStatus({ ...initialStatus, post: true });
                setUsers([]);
                setPosts([]);
            });
    }

    const renderBody = () => (
        <div className={styles.container}>
            <SearchBar
                handleSearch={handleSearch}
                searchText={searchText}
            />
            <div className={styles.wrapper}>
                <SearchUsers className={styles.users}/>
                <SearchPosts className={styles.posts}/>
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