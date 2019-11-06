import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

/** Redux */
import { apiSearch } from '../../../store/actions/searchActions';

/** Components */
import ProfileImage from '../../widgets/profile-image'

import styles from './navbar.module.css'
import { PostItemMinimal } from '../../widgets/post-item';

const SearchBar = () => {

    const dispatch = useDispatch();
    const searchText = useRef('');
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        document.body.addEventListener('click', resetState)
        return () => {
            document.body.removeEventListener('click', resetState)
        };
    }, [])

    const resetState = () => {
        setIsSearching(false);
        setNoData(false);
        setUsers([]);
        setPosts([]);
    }

    const handleSearch = e => {
        if (e) e.preventDefault();
        if ( ! searchText.current.value) return;
    }

    const handleChange = e => {
        e.target.value.trim();
        setIsSearching(!!e.target.value);
        setNoData(false);
        dispatch(apiSearch(searchText.current.value))
            .then(data => {
                // Sometimes canceling token will return undefined
                if ( ! data) return;

                if (data.users.length === 0 && data.posts.length === 0) {
                    return setNoData(true);
                }
                setUsers(data.users);
                setPosts(data.posts);
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

    const renderUsers = () => users.map(({User: user}, i) => (
        <Link to={`/profiles/${user.username}`}
            key={i}
        >
            <div className={styles.userItem}>
                <div className={styles.userImage}>
                    <ProfileImage
                        size={32}
                        src={user.avatar_url}
                        />
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userItemName}>
                        {user.first_name + ' ' + user.last_name}
                    </div>
                    <span className="username">
                        @{user.username}
                    </span>
                </div>
            </div>
        </Link>
    )); 
    
    const renderPosts = () => posts.map((post, i) => (
        <PostItemMinimal
            post={post}
            key={post.Post.id + i}
        />
    ));

    return (
        <div className={styles.search}>
            <form onSubmit={handleSearch}>
                <input type="text"
                    placeholder="Search"
                    name="search_bar"
                    ref={searchText}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    autoComplete="off"
                    onPaste={e => e.preventDefault()}
                    />
            </form>
            <div className={classNames(styles.searchList, {
                [styles.active]: isSearching
            })}>
                <div className={styles.searchContent}
                    style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                    {users.length === 0 && posts.length === 0 && renderSearching()}
                    {users.length > 0 && renderUsers()}
                    {posts.length > 0 && renderPosts()}
                </div>
                {users.length > 0 || posts.length > 0
                    ? <Link to={`/search?searchText=${getSearchText()}`}>
                    <div className={styles.viewMore}>
                        View More
                    </div>
                </Link>
                : ''}
            </div>
        </div>
    );
}

export default SearchBar;