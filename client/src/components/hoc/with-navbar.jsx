import React from 'react'
import PropTypes from 'prop-types'

import Navbar from '../fragments/navbar'

const WithNavbar = (props) => {
    return (
        <div>
            <Navbar/>
            {}
        </div>
    )
}

WithNavbar.propTypes = {

}

export default WithNavbar
