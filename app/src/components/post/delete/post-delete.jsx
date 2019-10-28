import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/** Redux */
import { deletePost } from '../../../store/actions/postActions'

/** Components */
import PModal from '../../widgets/p-modal'

const PostDelete = ({
    id,
    onRequestClose,
    onSuccess,
    ...props
}) => {

    const [isSuccess, setIsSuccess] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = e => {
        if (e) {
            e.preventDefault();
        }
        dispatch(deletePost(id))
            .then(() => {
                onSuccess()
                setIsSuccess(true)
            });
    }

    if (isSuccess) {
        return (
            <PModal onRequestClose={onRequestClose}>
                Your post was successfully deleted!
            </PModal>
        )
    }

    return (
        <form onSubmit={handleDelete}>
            <PModal type="submit"
                onRequestClose={onRequestClose}
            >
                Are you sure you want to delete your post?
            </PModal>
        </form>
    )
};

export default PostDelete;