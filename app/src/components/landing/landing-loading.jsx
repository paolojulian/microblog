import React from 'react';
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
            <div className={styles.postImg}></div>
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

    return (
        <div className={styles.landing}>
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