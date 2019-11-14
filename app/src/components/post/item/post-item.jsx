import React, { useState, useContext } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import styles from './post-item.module.css'

/** Redux */
import { likePost } from '../../../store/actions/postActions'

/** Components */
import PCard from '../../widgets/p-card'
import ProfileImage from '../../widgets/profile-image'
import PostEdit from '../edit'
import PostDelete from '../delete'
import PostShare from '../share'
import LikesModal from '../likes'

/** Consumer */
import { ModalConsumer, ModalContext } from '../../widgets/p-modal/p-modal-context'
import PostImage from '../../widgets/post-image'
import PostComments from './post-comments'
import Username from '../../widgets/username'
import PostTitle from '../title'

const fromNow = date => {
    return moment(date).fromNow()
}

const SharedItem = ({
}) => {

}

const PostItem = ({
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
    ownerId,
    retweet_post_id,
    postUserId,
    originalAvatarUrl,
    shared_body,
    shared_by,
    shared_by_username,
    title,
    user_id,
}) => {
    const dispatch = useDispatch();
    const context = useContext(ModalContext);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [commentsCount, setCommentsCount] = useState(comments);
    const [isLiked, setIsLiked] = useState(likes.indexOf(loggedin_id) !== -1);
    const [isEdit, setIsEdit] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const isOwned = Number(loggedin_id) === Number(user_id);
    const isCreator = Number(loggedin_id) === Number(ownerId);

    const handleLike = () => {
        dispatch(likePost(id))
        if (isLiked) {
            setLikeCount(likeCount - 1)
        } else {
            setLikeCount(likeCount + 1)
        }
        setIsLiked(!isLiked)
    }

    const onSuccessEdit = () => {
        setIsEdit(false)
        fetchHandler();
    }

    const onSuccessDelete = () => {
        window.scrollTo({ top: 0, left: 0 });
        fetchHandler();
    }

    const renderUsername = () => {
        if (shared_by && shared_by_username) {
            return (
                <span>
                    <Link to={`/profiles/${shared_by_username}`}>
                        <span className="username">
                            @{shared_by_username}&nbsp;
                        </span>
                    </Link>
                    shared&nbsp;
                    {shared_by == postUserId ? 'own' : 'a'}
                    &nbsp;
                    <Link to={`/posts/${retweet_post_id}`}>
                        <span className="username">
                            post
                        </span>
                    </Link>
                </span>
            )
        }

        return (
            <Link to={`/profiles/${creator}`}>
                <span className="text-link">
                    @{creator}
                </span>
            </Link>
        )
    }

    const renderBody = () => (
        <div className={styles.body}>
            {shared_body && <div className={styles.sharedBody}>
                {shared_body}
            </div>}
            {shared_by && <div className={styles.originalCreator}>
                <div className={styles.originalAvatar}>
                    <ProfileImage src={originalAvatarUrl} size={32}/>
                </div>
                <div className={styles.originalUsername}>
                    <Username username={creator}/>
                </div>
            </div>}
            <div className={styles.bodyText}>{body}</div>
            {!!imgPath && <PostImage imgPath={imgPath} title={title}/>}
        </div>
    )

    return (
        <PCard className={styles.post_item} size="fit">
            {/** Time */}
            <div className={styles.from_now}>
                {fromNow(created)}
            </div>
            {/** Profile Header */}
            <div className={styles.profile_header}>
                <ProfileImage
                    src={avatarUrl}
                    size={32}
                    alt={creator}
                />
                {/** Header */}
                <div className={styles.title}>
                    <PostTitle title={title} postId={id} />
                    {renderUsername()}
                </div>
                {/** Edit Post */}
                {isOwned && isCreator && <div className={styles.edit}
                    onClick={() => setIsEdit(!isEdit)}
                >
                    <i className="fa fa-edit"/>
                </div>}
                {/** Delete Post */}
                {isCreator && <ModalConsumer>
                    {({ showModal }) => (
                        <div className={styles.delete}
                            onClick={() => showModal(PostDelete, {
                                id,
                                creator,
                                onSuccess: onSuccessDelete
                            })}
                        >
                            <i className="fa fa-trash"/>
                        </div>
                    )}
                </ModalConsumer>}
                {/** Share Post */}
                {<ModalConsumer>
                    {({ showModal }) => (
                        <div className={styles.share}
                            onClick={() => showModal(PostShare, {
                                id: isShared ? retweet_post_id : id,
                                title,
                                body,
                                creator,
                                onSuccess: fetchHandler
                            })}
                        >
                            <i className="fa fa-share-square"/>
                        </div>
                    )}
                </ModalConsumer>}
            </div>

            {/** Body */}
            {isEdit
                ? <PostEdit
                    id={id}
                    title={title}
                    body={body}
                    imgPath={imgPath}
                    onSuccess={onSuccessEdit}
                    />
                : renderBody()}
            
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
    title: PropTypes.string,
    body: PropTypes.string,
    user_id: PropTypes.string,
    creator: PropTypes.string,
    created: PropTypes.string,
    modified: PropTypes.string,
    isShared: PropTypes.bool,
    loggedin_id: PropTypes.string,
    likes: PropTypes.array,
    comments: PropTypes.number,
}

PostItem.defaultProps = {
    likes: [],
    comments: 0,
    isShared: false
}

export default PostItem
