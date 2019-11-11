import React from 'react';
import { Link } from 'react-router-dom';

const Username = ({ username, ...props }) => {
    return (
        <Link to={`/profiles/${username}`}>
            <span className="username"
                {...props}
            >
                @{username}
            </span>
        </Link>
    )
}

export default Username
