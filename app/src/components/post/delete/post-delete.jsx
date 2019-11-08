import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

/** Redux */
import { deletePost } from '../../../store/actions/postActions'

/** Components */
import PModal from '../../widgets/p-modal'
import PLoader from '../../widgets/p-loader'

const PostDelete = ({
    id,
    onRequestClose,
    onSuccess,
}) => {

    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = e => {
        if (e) {
            e.preventDefault();
        }
        setLoading(true);
        dispatch(deletePost(id))
            .then(() => {
                onSuccess()
                setIsSuccess(true)
            })
            .catch(() => setError(true))
            .then(() => setLoading(false));
    }

    if (isError) {
        <PModal onRequestClose={onRequestClose}>
            <div className="disabled">Oops. Something went wrong</div>
        </PModal>
    }

    if (isLoading) {
        return (
            <PModal onRequestClose={onRequestClose}>
                <PLoader/>
            </PModal>
        )
    }

    if (isSuccess) {
        return (
            <PModal onRequestClose={onRequestClose}>
                Your post was successfully deleted!
            </PModal>
        )
    }

    return (
        <PModal type="submit"
            onRequestSubmit={handleDelete}
            onRequestClose={onRequestClose}
        >
            Are you sure you want to delete your post?
        </PModal>
    )
};

export default PostDelete;