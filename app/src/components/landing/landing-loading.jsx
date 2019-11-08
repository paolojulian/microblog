import React, { useEffect, useState } from 'react';
import styles from './landing-loading.module.css';
import { TextMock, RoundedMock } from '../widgets/wireframes';

const Profile = () => (
    <div className={styles.profile}>
        <div className={styles.profileImg}>
            <RoundedMock size="7rem"/>
        </div>
        <div className={styles.profileInfo}>
            <TextMock/>
            <TextMock/>
            <TextMock/>
        </div>
    </div>
)

const Post = () => (
    <div className={styles.post}>
        <div className={styles.header}>
            <RoundedMock size="36px"/>
            <div className={styles.postTitle}>
                <TextMock/>
                <TextMock/>
            </div>
        </div>
        <div className={styles.postBody}>
            <TextMock/>
            <TextMock/>
            <TextMock/>
        </div>
    </div>
)

const Right = () => (
    <div className={styles.right}>
    </div>
)

const LandingLoading = () => {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let cancel = false;
        let timeout = setTimeout(() => {
            if ( ! cancel) {
                setMounted(true);
            }
        }, 0);
        return () => {
            clearTimeout(timeout);
            cancel = true;
        };
    }, [])

    return (
        <div
            style={{ visibility: mounted ? 'visible': 'hidden' }}
            className={styles.landing}>
            <Profile/>
            <div className={styles.container}>
                <Post/>
                <Post/>
                <Post/>
            </div>
            <Right/>
        </div>
    )
}

export default LandingLoading;