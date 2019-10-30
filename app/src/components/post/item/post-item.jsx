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

/** Consumer */
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context'

const fromNow = date => {
    return moment(date).fromNow()
}

const PostItem = ({
    id,
    title,
    body,
    user_id,
    creator,
    shared_by,
    shared_by_username,
    likes,
    avatarUrl,
    comments,
    loggedin_id,
    created,
    ownerId,
    imageName,
    fetchHandler,
    ...props
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

    const renderSharedBy = () => {
        if ( ! shared_by) return '';
        if ( ! shared_by_username) return '';

        return (
            <div className={styles.sharedBy}>
                Shared By:&nbsp;
                <Link to={`/profiles/${shared_by_username}`}>
                    <span className="text-link">
                        @{shared_by_username}&nbsp;
                    </span>
                </Link>
            </div>
        )
    }

    const renderBody = () => (
        <div className={styles.body}>
            {renderSharedBy()}
            <Link to={`/profiles/${creator}`}>
                <span className="text-link">
                    @{creator}&nbsp;
                </span>
            </Link>
            {body}
        </div>
    )

    return (
        <PCard className={styles.post_item}>
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
                        {title}
                    </Link>
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
                                onSuccess: fetchHandler
                            })}
                        >
                            <i className="fa fa-trash"/>
                        </div>
                    )}
                </ModalConsumer>}
                {!isOwned && !isCreator && <ModalConsumer>
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
                    onSuccess={onSuccessEdit}
                    />
                : renderBody()}

            <div className={styles.actions}>
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
                <Link to={`/posts/${id}`}>
                    <button type="button"
                        className={styles.comment}
                    >
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
    loggedin_id: PropTypes.string,
    likes: PropTypes.array,
    comments: PropTypes.number,
}

PostItem.defaultProps = {
    likes: [],
    comments: 0
}

export default PostItem
