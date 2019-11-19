import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

/** Components */
import Navbar from '../fragments/navbar';

const NotFoundComponent = ({
    redirectLink,
    history,
}) => {
    const [countDown, setCountDown] = useState(5);
    let countDownTimeout = null;

    useEffect(() => {
        if (countDown <= 0) {
            return history.push(redirectLink);
        }
        handleCountDown();
        return () => {
            clearTimeout(countDownTimeout);
        };
    }, [countDown])

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
                color: 'var(--black-disabled)'
            }}>

                <div style={{
                    fontWeight: '400',
                    fontSize: '2rem',
                    fontStyle: 'italic',
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
        </div>
    )
}

const NoMatch = ({ history }) => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const redirectLink = isAuthenticated ? '/' : '/login';

    if (isAuthenticated) {
        return (
            <div>
                <Navbar/>
                <NotFoundComponent
                    history={history}
                    redirectLink={redirectLink}
                />
            </div>
        )
    }
    return <NotFoundComponent
        history={history}
        redirectLink={redirectLink}
    />;
}

export default withRouter(NoMatch);
