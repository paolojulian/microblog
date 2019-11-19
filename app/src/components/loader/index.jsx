import React from 'react';
import { useSelector } from 'react-redux';

/** Components */
import Navbar from '../fragments/navbar';
import PLoader from '../widgets/p-loader';

const Loading = () => {
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
                <PLoader />
            </div>
        </div>
    )
}

const Loader = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    if (isAuthenticated) {
        return (
            <div>
                <Navbar/>
                <Loading />
            </div>
        )
    }
    return <Loading />;
}

export default Loader;
