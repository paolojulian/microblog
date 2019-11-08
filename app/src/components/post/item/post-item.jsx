import React, { useState } from 'react'
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
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context'
import PostImage from '../../widgets/post-image'

const fromNow = date => {
    return moment(date).fromNow()
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
    shared_by,
    shared_by_username,
    title,
    user_id,
}) => {
    const dispatch = useDispatch()
    const [likeCount, setLikeCount] = useState(likes.length)
    const [isLiked, setIsLiked] = useState(likes.indexOf(loggedin_id) !== -1)
    const [isEdit, setIsEdit] = useState(false)
    const isOwned = Number(loggedin_id) === Number(user_id)
    const isCreator = Number(loggedin_id) === Number(ownerId)

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
                    shared a&nbsp;
                    <Link to={`/posts/${retweet_post_id}`}>
                        <span className="username">
                            post
                        </span>
                    </Link>
                    &nbsp;by&nbsp;
                    <Link to={`/profiles/${creator}`}>
                        <span className="username">
                            @{creator}
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
            <div className={styles.bodyText}>{body}</div>
            {!!imgPath && <PostImage imgPath={imgPath} title={title}/>}
        </div>
    )

    return (
        <PCard className={styles.post_item} size="fit">
            <div className={styles.from_now}>
                {fromNow(created)}
            </div>

            <div className={styles.profile_header}>
                <ProfileImage
                    src={avatarUrl}
                    size={32}
                    alt={creator}
                />
                <div className={styles.title}>
                    <Link to={`/posts/${id}`}>
                        <span className={styles.titleText}>
                            {title}
                        </span>
                    </Link>
                    {renderUsername()}
                </div>
                {isOwned && isCreator && <div className={styles.edit}
                    onClick={() => setIsEdit(!isEdit)}
                >
                    <i className="fa fa-edit"/>
                </div>}
                {isOwned && isCreator && <ModalConsumer>
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
                {!isOwned && !isCreator && !isShared && <ModalConsumer>
                    {({ showModal }) => (
                        <div className={styles.share}
                            onClick={() => showModal(PostShare, {
                                id,
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

            {isEdit
                ? <PostEdit
                    id={id}
                    title={title}
                    body={body}
                    imgPath={imgPath}
                    onSuccess={onSuccessEdit}
                    />
                : renderBody()}

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
                <Link to={`/posts/${id}`}>
                    <button type="button"
                        className={styles.comment}
                    >
                        Comments&nbsp;
                        <i className="fa fa-comment">
                            &nbsp;{comments}
                        </i>
                    </button>
                </Link>
            </div>
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
