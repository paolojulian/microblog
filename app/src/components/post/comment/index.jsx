import React from 'react';
import PropTypes from 'prop-types';
import styles from './post-comment.module.css';

/** Components */
import CommentItem from './item';

const PostComment = ({
    reloadPost,
    comments
}) => {

    const renderComments = comments.reverse().map(comment => (
        <CommentItem
            key={comment.id}
            id={Number(comment.id)}
            body={comment.body}
            userId={Number(comment.user_id)}
            username={comment.username}
            avatarUrl={comment.avatarUrl}
            created={comment.created}
            reloadPost={reloadPost}
        />
    ));

    return (
        <div className={styles.wrapper}>
            {renderComments}
        </div>
    );
}

PostComment.propTypes = {
    comments: PropTypes.array.isRequired,
    reloadPost: PropTypes.func.isRequired
}

export default PostComment