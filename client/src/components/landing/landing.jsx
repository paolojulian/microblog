import React from 'react'

import WithNavbar from '../hoc/with-navbar';

const Landing = () => {
    return (
        <div className="landing">
            Home Page
        </div>
    )
}

export default WithNavbar(Landing)