import React from 'react';

const ServerError = () => (
    <div style={{
        color: 'var(--black-disabled)',
        fontStyle: 'italic',
        fontSize: '0.9rem'
    }}>
        Oops.. Something went wrong
        <p>Please try again later.</p>
    </div>
);

export default ServerError;
