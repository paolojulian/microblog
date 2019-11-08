import React from 'react'

const NoMatch = () => {
    return (
        <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'none'
        }}>
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontWeight: '400',
                fontSize: '2rem',
                fontStyle: 'italic',
                color: 'var(--black-disabled)'
            }}>

                The page you requested was not found
            </div>
        </div>
    )
}

export default NoMatch;
