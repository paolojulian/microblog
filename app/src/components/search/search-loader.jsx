import React from 'react';
import styles from './search-loader.module.css';
import loadingStyles from '../widgets/wireframes/loading-mocks.module.css';
import { TextMock, TextInputMock, RoundedMock } from '../widgets/wireframes';

const SearchBar = () => (
    <div className={loadingStyles.card}>
        <TextInputMock
            placeholder="Search"
        />
    </div>
)

const Users = () => (
    <div className={styles.users}>
        <Profile/>
        <Profile/>
    </div>
)

const Profile = () => (
    <div className={loadingStyles.card}>
        <TextMock/>
        <TextMock/>
    </div>
)

const Posts = () => (
    <div className={styles.posts}>
        <Post/>
        <Post/>
    </div>
)

const Post = () => (
    <div className={loadingStyles.card}>
        <div className={styles.postHeader}>
            <RoundedMock size="24px"/>
            <TextMock/>
        </div>
        <div className={styles.postBody}>
            <TextMock/>
            <TextMock/>
        </div>
    </div>
)

const SearchLoader = () => (
    <div className={styles.container}>
        <SearchBar />
        <div className={styles.wrapper}>
            <Users/>
            <Posts/>
        </div>
    </div>
)

export default SearchLoader