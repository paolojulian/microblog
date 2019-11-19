import React, { useState, useContext, useEffect } from 'react'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import styles from './post-item.module.css'

/** Redux */
import { likePost } from '../../../store/actions/postActions'

/** Consumer */
import { ModalConsumer, ModalContext } from '../../widgets/p-modal/p-modal-context'

/** Components */
import PCard from '../../widgets/p-card'
import LikesModal from '../likes'
import PostImage from '../../widgets/post-image'
import PostComments from './post-comments'
import SharedPost from './shared-post'
import PostHeader from '../header'
import PostActions from '../actions'

const PostItem = ({
    openCommentOnStart,
    sharedPost,
    id,
    avatarUrl,
    body,
    comments,
    created,
    creator,
    fetchHandler,
    imgPath,
    isShared,
    likes,
    loggedin_id,
    retweet_post_id,
    title,
    user_id,
}) => {
    const dispatch = useDispatch();
    const context = useContext(ModalContext);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [commentsCount, setCommentsCount] = useState(comments);
    const [isLiked, setIsLiked] = useState(likes.indexOf(String(loggedin_id)) !== -1);
    const [showComment, setShowComment] = useState(false);

    useEffect(() => {
        if (openCommentOnStart) {
            setShowComment(true);
        }
    }, [])

    const handleLike = () => {
        dispatch(likePost(id))
        if (isLiked) {
            setLikeCount(likeCount - 1)
        } else {
            setLikeCount(likeCount + 1)
        }
        setIsLiked(!isLiked)
    }

    const successHandler = () => {
        window.scrollTo({ top: 0, left: 0 })
        fetchHandler();
    }

    const renderBody = () => (
        <div className={styles.body}>
            <div className={styles.bodyText}>{body}</div>
            {!!imgPath && <PostImage imgPath={imgPath} title={title}/>}
        </div>
    )

    return (
        <PCard className={styles.post_item} size="fit">
            <PostActions
                postId={id}
                userId={isShared ? sharedPost.userId : user_id}
                isShared={isShared}
                title={isShared ? '': title}
                body={isShared ? sharedPost.body: body}
                imgPath={imgPath}
                username={creator}
                sharedPostId={isShared ? retweet_post_id : id}
                onSuccessEdit={successHandler}
                onSuccessDelete={successHandler}
                onSuccessShare={successHandler}
            />
            {isShared && <SharedPost
                postId={id}
                userId={sharedPost.userId}
                originalUserId={user_id}
                body={sharedPost.body}
                avatarUrl={sharedPost.avatarUrl}
                username={sharedPost.username}
                created={sharedPost.created}
            />}

            <PostHeader
                postId={isShared ? retweet_post_id : id}
                title={title}
                username={creator}
                avatarUrl={avatarUrl}
                created={created}
            />

            {renderBody()}
            
            {/** Actions */}
            <div className={styles.actions}>
                <span>
                    {likeCount > 0 && <ModalConsumer>
                        {({ showModal }) => (
                        <button type="button"
                            onClick={() => showModal(LikesModal, { postId: Number(id) })}
                        >
                            Likes
                        </button>
                        )}
                    </ModalConsumer>}
                    <button type="button"
                        className={classnames(styles.like, {
                            [styles.active]: isLiked
                        })}
                        onClick={handleLike}
                    >
                        <i className="fa fa-thumbs-up">
                            &nbsp;{likeCount}
                        </i>
                    </button>
                </span>
                <button type="button"
                    className={styles.comment}
                    onClick={() => setShowComment(!showComment)}
                >
                    Comments&nbsp;
                    <i className="fa fa-comment">
                        &nbsp;{commentsCount}
                    </i>
                </button>
            </div>

            {/** Comments */}
            {showComment && <PostComments
                postId={Number(id)}
                onUpdateCommentCount={value => setCommentsCount(value)}
                onRequestSuccessCreate={() => {
                    context.notify.success("Successfully commented on post");
                }}
                onRequestClose={() => setShowComment(false)}
            />}
        </PCard>
    )
}

PostItem.propTypes = {
    openCommentOnStart: PropTypes.bool,
    title: PropTypes.string,
    body: PropTypes.string,
    user_id: PropTypes.number,
    creator: PropTypes.string,
    created: PropTypes.string,
    modified: PropTypes.string,
    isShared: PropTypes.bool,
    loggedin_id: PropTypes.number,
    likes: PropTypes.array,
    comments: PropTypes.number,
}

PostItem.defaultProps = {
    likes: [],
    comments: 0,
    isShared: false,
    openCommentOnStart: false
}

export default PostItem
