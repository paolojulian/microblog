import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

/** Redux Actions */
import { logoutUser } from '../../../store/actions/authActions'

import styles from './navbar.module.css'

const Navbar = ({
    logoutUser,
    history
}) => {
    return (
        <nav>
            <ul className={styles.container}>
                <li>Logo</li>
                <li className={styles.search}>
                    <input type="text"
                        placeholder="Search"
                        name="search_bar"
                        />
                </li>
                <Link to="/"><li>Home</li></Link>
                <Link to="/profile"><li>Profile</li></Link>
                <li onClick={() => logoutUser(history)}>
                    Logout
                </li>
            </ul>
        </nav>
    )
}

export default connect(null, { logoutUser })(withRouter(Navbar));