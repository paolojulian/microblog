import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

const NoMatch = ({ history }) => {

    const { isAuthenticated } = useSelector(state => state.auth);
    const [countDown, setCountDown] = useState(5);
    const redirectLink = isAuthenticated ? '/' : '/login';
    let countDownTimeout = null;

    useEffect(() => {
        handleCountDown();
        let timeout = setTimeout(() => {
            history.push(redirectLink);
        }, 5000);
        return () => {
            clearTimeout(timeout);
            clearTimeout(countDownTimeout);
        };
    }, [])

    const handleCountDown = () => {
        countDownTimeout = setTimeout(() => {
            setCountDown(countDown - 1)
            handleCountDown();
        }, 1000)
    }

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
            <div>Page will be redirecting in {countDown}</div>
            <div>
                <Link to="/">
                    Go back to home
                </Link>
            </div>
        </div>
    )
}

export default withRouter(NoMatch);
