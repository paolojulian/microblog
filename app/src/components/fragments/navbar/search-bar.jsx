import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom';

/** Redux */
import { apiSearch } from '../../../store/actions/searchActions';

import styles from './navbar.module.css'
import { PostItemMinimal } from '../../widgets/post-item';
import UserItem from '../../widgets/user';

const SearchBar = ({ history, location }) => {

    const dispatch = useDispatch();
    const searchText = useRef('');
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [willShow, setShow] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [noData, setNoData] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(false);

    useEffect(() => {
        document.body.addEventListener('click', resetState)
        return () => {
            document.body.removeEventListener('click', resetState)
        };
    }, [])

    const resetState = () => {
        setShow(false);
    }

    const handleSearch = e => {
        if (e) e.preventDefault();
        if (searchText.current.value) {
            history.push(`/search?searchText=${getSearchText()}`)
        }
    }

    const handleChange = value => {
        if (location.pathname === '/search') {
            // history.push(`/search?searchText=${getSearchText()}`)
            return;
        }
        setIsSearching(!!value);
        setShow(!!value);
        if (value.length === 0) {
            setNoData(true);
            setUsers([]);
            setPosts([]);
            return;
        }
        setNoData(false);
        dispatch(apiSearch(searchText.current.value))
            .then(data => {
                // Sometimes canceling token will return undefined
                try {
                    if ( ! data) return;
                } catch (e) {
                    return;
                }

                if (
                    data.users.list.length === 0 &&
                    data.posts.list.length === 0
                ) {
                    setNoData(true);
                }
                if (
                    data.users.totalLeft > 0 ||
                    data.posts.totalLeft > 0
                ) {
                    setHasMoreData(true);
                } else {
                    setHasMoreData(false);
                }
                setUsers(data.users.list);
                setPosts(data.posts.list);
            });
    }

    const handleKeyPress = e => {
        const re = /^[a-z0-9_ ]*$/i
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }

    const getSearchText = () => {
        return searchText.current.value.replace(/[\W_]+/g," ");
    }

    const renderSearching = () => {
        if (noData) return (
            <div className="alert-disabled">
                No data found.
            </div>
        );
        return (
            <div className="alert-disabled">
                <i className="fa fa-spinner fa-spin"></i>
                &nbsp;Searching..
            </div>
        )
    };

    const renderUsers = () => users.map(({ User: user }, i) => (
        <UserItem
            key={user.id + i}
            user={user}
            showFollow={false} />
    )); 
    
    const renderPosts = () => posts.map((post, i) => (
        <PostItemMinimal
            post={post}
            key={post.Post.id + i}
        />
    ));

    const stopPropagate = e => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        return false;
    }

    return (
        <div className={styles.search}>
            <div className={styles.searchForm}
                onClick={() => setShow(true)}
            >
                <form onSubmit={handleSearch}>
                    <input type="text"
                        placeholder="Search"
                        name="search_bar"
                        ref={searchText}
                        onChange={e => handleChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoComplete="off"
                        onPaste={e => e.preventDefault()}
                        />
                </form>
                <div className={classNames(styles.searchList, {
                    [styles.active]: willShow && isSearching
                })}
                    onClick={stopPropagate}
                >
                    <div className={styles.searchContent}
                        style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                        {users.length === 0 && posts.length === 0 && renderSearching()}
                        {users.length > 0 && renderUsers()}
                        {posts.length > 0 && renderPosts()}
                    </div>
                    {hasMoreData && <Link to={`/search?searchText=${getSearchText()}`}>
                        <div className={styles.viewMore}>
                            View More
                        </div>
                    </Link>}
                </div>
            </div>
        </div>
    );
}

export default withRouter(SearchBar);