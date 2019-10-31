import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom';

/** Redux */
import { logoutUser } from '../../../store/actions/authActions'

/** Components */
import SearchBar from './search-bar'

import styles from './navbar.module.css'

const Navbar = ({
    history,
    location
}) => {

    const dispatch = useDispatch();

    const handleLogout = e => {
        if (e) e.preventDefault();
        dispatch(logoutUser(history));
    }

    const reloadOrNavigate = () => {
        if (location.pathname === '/home') {
            history.push('/');
        } else {
            history.push('/home');
        }
    };

    return (
        <nav>
            <ul className={styles.container}>
                <li>Logo</li>
                <li className={styles.search}>
                    <SearchBar/>
                </li>
                <span onClick={reloadOrNavigate}><li>Home</li></span>
                <li>Notifications</li>
                <li onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </nav>
    )
}

export default withRouter(Navbar);