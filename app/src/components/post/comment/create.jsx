import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

/** Context */
import { ModalContext } from '../../widgets/p-modal/p-modal-context'

/** Redux */
import { addComment } from '../../../store/actions/postActions';
import { CLEAR_ERRORS } from '../../../store/types'

/** Components */
import PFab from '../../widgets/p-fab';
import PLoader from '../../widgets/p-loader';
import FormTextArea from '../../widgets/form/textarea/form-textarea';

const styles = {
    padding: '0.5rem',
    width: '100%'
}

const initialError = {
    body: ''
}

const CommentCreate = ({
    userId,
    postId,
    onRequestSuccess,
}) => {

    const dispatch = useDispatch();
    const context = useContext(ModalContext);
    const comment = useRef('');
    const [errors, setErrors] = useState(initialError);
    const [hasComment, setHasComment] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = e => {
        if (e) e.preventDefault();
        const form = {
            user_id: userId,
            post_id: postId,
            body: comment.current.value
        }
        setLoading(true);
        dispatch(addComment(form))
            .then(handleSuccess)
            .catch(handleError)
            .then(() => setLoading(false));
    }

    const handleSuccess = () => {
        comment.current.value = ''
        setHasComment(false);
        onRequestSuccess();
        setErrors({ ...initialError });
        dispatch({ type: CLEAR_ERRORS })
    }

    const handleError = e => {
        try {
            if (e.response.status !== 422) {
                throw new Error();
            }
            setErrors(e.response.data.data.errors);
        } catch (err) {
            context.notify.serverError();
        }
    }

    const handleChange = e => {
        setHasComment(!!e.target.value);
    }

    const renderButton = () => {
        if (isLoading) {
            return (
                <div className="action_btns">
                    <PLoader />
                </div>
            )
        }

        if ( ! hasComment) return '';

        return (
            <div className="action_btns">
                <PFab
                    type="submit"
                    theme="primary"
                >
                    <i className="fa fa-check"/>
                </PFab>
            </div>
        ) 
    }

    return (
        <div styles={styles}>
            <form
                onSubmit={handleSubmit}
                className="form"
            >
                <FormTextArea
                    name="comment"
                    placeholder="Write a comment"
                    refs={comment}
                    onChange={handleChange}
                    error={errors.body}
                    rows={1}
                />
                {renderButton()}
            </form>
        </div>
    );
}

CommentCreate.propTypes = {
    userId: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    onRequestSuccess: PropTypes.func.isRequired,
}

export default CommentCreate