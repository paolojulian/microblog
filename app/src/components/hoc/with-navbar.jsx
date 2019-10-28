import React from 'react'

import Navbar from '../fragments/navbar'

const WithNavbar = OriginalComponent => {
    class NewComponent extends React.Component {
        render() {
            return (
                <div className="with-navbar">
                    <Navbar/>
                    <OriginalComponent {...this.props}/>
                </div>
            )
        }
    }
    return NewComponent
}

export default WithNavbar
