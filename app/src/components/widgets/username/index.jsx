import React from 'react';
import { Link } from 'react-router-dom';

const Username = ({ username, ...props }) => {
    return (
        <Link to={`/profiles/${username}`} {...props}>
            <span className="username"
            >
                @{username}
            </span>
        </Link>
    )
}

export default Username
