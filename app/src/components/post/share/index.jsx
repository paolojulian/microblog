import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/** Redux */
import { sharePost } from '../../../store/actions/postActions'

/** Components */
import PModal from '../../widgets/p-modal'

const PostShare = ({
    id,
    title,
    body,
    creator,
    onRequestClose,
    onSuccess,
    ...props
}) => {

    const [isSuccess, setIsSuccess] = useState(false);
    const dispatch = useDispatch();

    const handleShare = e => {
        if (e) {
            e.preventDefault();
        }
        dispatch(sharePost(id))
            .then(() => {
                onSuccess()
                setIsSuccess(true)
            });
    }

    if (isSuccess) {
        return (
            <PModal onRequestClose={onRequestClose}>
                You successfully shared @{creator}'s post 
            </PModal>
        )
    }

    return (
        <PModal type="submit"
            onRequestSubmit={handleShare}
            onRequestClose={onRequestClose}
        >
            Are you sure you want to share @{creator}'s post?
        </PModal>
    )
};

export default PostShare;