import React from 'react';
import styles from './index.module.css';
import { useSelector } from 'react-redux';

/** Consumer */
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context';

/** Components */
import PostDelete from '../delete/post-delete';
import PostShare from '../share';
import PostEdit from '../edit/post-edit';

const EditPost = ({
    onRequestEdit
}) => (
    <span className={styles.edit} onClick={onRequestEdit}>
        <i className="fa fa-edit"/>
    </span>
)

const DeletePost = ({
    onRequestDelete
}) => (
    <span className={styles.delete} onClick={onRequestDelete}>
        <i className="fa fa-trash"/>
    </span>
)

const SharePost = ({
    onRequestShare
}) => (
    <span className={styles.share} onClick={onRequestShare}>
        <i className="fa fa-share-square"/>
    </span>
)

const PostActions = ({
    postId,
    userId,
    isShared,
    title,
    body,
    imgPath,
    sharedPostId,
    username,
    onSuccessEdit,
    onSuccessDelete,
    onSuccessShare
}) => {

    const { id: loggedInUserId } = useSelector(state => state.auth.user);
    const isOwner = Number(loggedInUserId) === Number(userId);
    
    return (
        <ModalConsumer>
            {({ showModal }) => {

                const handleEdit = () => {
                    showModal(PostEdit, {
                        id: postId,
                        title,
                        body,
                        imgPath,
                        isShared,
                        onSuccess: onSuccessEdit
                    })
                }

                const handleDelete = () => {
                    showModal(PostDelete, {
                        id: postId,
                        onSuccess: onSuccessDelete
                    })
                }

                const handleShare = () => {
                    showModal(PostShare, {
                        id: sharedPostId,
                        creator: username,
                        onSuccess: onSuccessShare
                    })
                }

                return (
                    <div className={styles.wrapper}>
                        {isOwner && <EditPost onRequestEdit={handleEdit}/>}
                        {isOwner && <DeletePost onRequestDelete={handleDelete}/>}
                        <SharePost onRequestShare={handleShare}/>
                    </div>
                )
            }}
        </ModalConsumer>
    )
}

export default PostActions
