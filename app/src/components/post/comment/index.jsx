import React from 'react';
import PropTypes from 'prop-types';
import styles from './post-comment.module.css';

/** Components */
import CommentItem from './item';

const PostComment = ({
    comments
}) => {

    const renderComments = comments.map(comment => (
        <CommentItem
            key={comment.id}
            id={Number(comment.id)}
            body={comment.body}
            userId={Number(comment.userId)}
            username={comment.username}
            created={comment.created}
        />
    ));

    return (
        <div className={styles.wrapper}>
            {renderComments}
        </div>
    );
}

PostComment.propTypes = {
    comments: PropTypes.array.isRequired
}

export default PostComment