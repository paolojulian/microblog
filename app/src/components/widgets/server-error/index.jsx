import React from 'react';

const ServerError = () => (
    <div style={{
        color: 'var(--secondary)',
        fontStyle: 'italic',
        fontSize: '0.9rem'
    }}>
        Oops.. Something went wrong
        <div>
            Please try again later.
        </div>
    </div>
);

export default ServerError;
