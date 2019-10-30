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
    history
}) => {

    const dispatch = useDispatch();

    const handleLogout = e => {
        if (e) e.preventDefault();
        dispatch(logoutUser(history));
    }

    return (
        <nav>
            <ul className={styles.container}>
                <li>Logo</li>
                <li className={styles.search}>
                    <SearchBar/>
                </li>
                <Link to="/"><li>Home</li></Link>
                <li>Notifications</li>
                <li onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </nav>
    )
}

export default withRouter(Navbar);