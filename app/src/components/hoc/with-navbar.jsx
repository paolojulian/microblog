import React from 'react'
import PropTypes from 'prop-types'

import Navbar from '../fragments/navbar'

const WithNavbar = OriginalComponent => {
    class NewComponent extends React.Component {
        render() {
            return (
                <div className="with-navbar">
                    <Navbar/>
                    <OriginalComponent/>
                </div>
            )
        }
    }
    return NewComponent
}

WithNavbar.propTypes = {

}

export default WithNavbar
