import React from 'react'
import styles from './search.module.css'

/** Components */
import { withRouter } from 'react-router-dom'
import WithNavbar from '../hoc/with-navbar'

const PSearch = (props) => {
    const { searchText } = props.match.params;

    return (
        <div>Hi</div>
    )
}

export default withRouter(WithNavbar(PSearch))