import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

/** Redux */
import { deleteComment } from '../../../store/actions/postActions'

/** Components */
import PModal from '../../widgets/p-modal'
import ServerError from '../../widgets/server-error'

const PostDelete = ({
    id,
    onRequestClose,
    onRequestSuccess,
}) => {

    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = e => {
       if (e) e.preventDefault();

        dispatch(deleteComment(id))
            .then(handleSuccess)
            .catch();
    }

    const handleSuccess = () => {
        onRequestSuccess()
        setIsSuccess(true)
    }

    if (isError) {
        return (
            <PModal onRequestClose={onRequestClose}>
                <ServerError/>
            </PModal>
        );
    }

    if (isSuccess) {
        return (
            <PModal onRequestClose={onRequestClose}>
                Your comment was successfully deleted!
            </PModal>
        )
    }

    return (
        <PModal type="submit"
            onRequestSubmit={handleDelete}
            onRequestClose={onRequestClose}
        >
            Are you sure you want to delete your comment?
        </PModal>
    )
};

PostDelete.propTypes = {
    id: PropTypes.number.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onRequestSuccess: PropTypes.func.isRequired
}

export default PostDelete;