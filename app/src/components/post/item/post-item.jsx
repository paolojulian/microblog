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

const fromNow = date => {
    return moment(date).fromNow()
}

const PostItem = ({
    id,
    title,
    body,
    user_id,
    creator,
    likes,
    comments,
    loggedin_id,
    created
}) => {
    const dispatch = useDispatch()
    const [likeCount, setLikeCount] = useState(likes.length)
    const [isLiked, setIsLiked] = useState(likes.indexOf(loggedin_id) !== -1)
    const [isEdit, setIsEdit] = useState(false)
    const isOwned = Number(loggedin_id) === Number(user_id)

    const handleLike = () => {
        dispatch(likePost(id))
        if (isLiked) {
            setLikeCount(likeCount - 1)
        } else {
            setLikeCount(likeCount + 1)
        }
        setIsLiked(!isLiked)
    }

    const renderBody = () => (
        <div className={styles.body}>
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
                    src={`/app/webroot/img/profiles/${user_id}/${creator}x32.png`}
                    size={32}
                    alt={creator}
                />
                <div className={styles.title}>
                    {title}
                </div>
                {isOwned && <div className={styles.edit}
                    onClick={() => setIsEdit(!isEdit)}
                >
                    <i className="fa fa-edit"/>
                </div>}
                {isOwned && <div className={styles.delete}>
                    <i className="fa fa-trash"/>
                </div>}
            </div>

            {isEdit
                ? <PostEdit
                    id={id}
                    title={title}
                    body={body}
                    onSuccess={() => setIsEdit(false)}
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
                <button type="button"
                    className={styles.comment}
                >
                    <i className="fa fa-comment">
                        &nbsp;{comments}
                    </i>
                </button>
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
