import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

const PostTitle = ({
    title,
    postId
}) => {
    return (
        <div className={styles.title} >
            <Link to={`/posts/${postId}`}>
                <span>
                    {title ? title : 'Untitled'}
                </span>
            </Link>
        </div>
    )
}

export default PostTitle
