import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

/** Redux */
import { searchUser } from '../../../store/actions/profileActions'

/** Components */
import ProfileImage from '../../widgets/profile-image'

import styles from './navbar.module.css'

const SearchBar = () => {

    const dispatch = useDispatch();
    const searchText = useRef('');
    const [users, setUsers] = useState([]);
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
    }

    const handleSearch = e => {
        if (e) e.preventDefault();
        if ( ! searchText.current.value) return;
    }

    const handleChange = e => {
        e.target.value.trim();
        setIsSearching(!!e.target.value);
        setNoData(false);
        if (!e.target.value) {
            return setUsers([])
        }
        dispatch(searchUser(searchText.current.value))
            .then(data => {
                // Sometimes canceling token will return undefined
                if ( ! data) return;

                if (data.length === 0) {
                    setUsers([]);
                    return setNoData(true);
                }
                setUsers(data)
            });
    }

    const renderSearching = () => {
        if (noData) return (
            <div className="alert-disabled">
                No data found.
            </div>
        );
        return (
            <div className="alert-disabled">
                Searching..
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

    return (
        <div className={styles.search}>
            <form onSubmit={handleSearch}>
                <input type="text"
                    placeholder="Search"
                    name="search_bar"
                    ref={searchText}
                    onChange={handleChange}
                    autoComplete="off"
                    />
            </form>
            <div className={classNames(styles.searchList, {
                [styles.active]: isSearching
            })}>
                <div className={styles.searchContent}>
                    {users.length > 0  ? renderUsers(): renderSearching()}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;