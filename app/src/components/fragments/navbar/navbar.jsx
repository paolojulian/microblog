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
            <SearchBar/>
            <div className={styles.logo}>Logo</div>
            <ul className={styles.container}>
                <li
                    className={styles.home}
                    onClick={reloadOrNavigate}>
                    Home
                </li>
                <li className={styles.notification}>
                    <i className="fa fa-bell"/>
                </li>
                <li className={styles.logout}
                    onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </nav>
    )
}

export default withRouter(Navbar);