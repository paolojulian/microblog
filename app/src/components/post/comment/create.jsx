import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

/** Redux */
import { addComment } from '../../../store/actions/postActions';

/** Components */
import PCard from '../../widgets/p-card';
import PFab from '../../widgets/p-fab';
import FormTextArea from '../../widgets/form/textarea/form-textarea';

const CommentCreate = ({
    userId,
    postId,
    onRequestSuccess
}) => {

    const dispatch = useDispatch();
    const comment = useRef('');
    const [hasComment, setHasComment] = useState(false);

    const handleSubmit = e => {
        if (e) e.preventDefault();
        const form = {
            user_id: userId,
            post_id: postId,
            body: comment.current.value
        }
        dispatch(addComment(form))
            .then(handleSuccess)
            .catch()
            .then();
    }

    const handleSuccess = () => {
        comment.current.value = ''
        setHasComment(false);
        onRequestSuccess();
    }

    const handleChange = e => {
        setHasComment(!!e.target.value);
    }

    return (
        <PCard size="fit">
            <form
                onSubmit={handleSubmit}
                className="form"
            >
                <FormTextArea
                    name="comment"
                    placeholder="Write a comment"
                    refs={comment}
                    onChange={handleChange}
                    rows={1}
                />
                {hasComment && <div className="action_btns">
                    <PFab
                        type="submit"
                        theme="primary"
                    >
                        <i className="fa fa-check"/>
                    </PFab>
                </div>}
            </form>
        </PCard>
    );
}

CommentCreate.propTypes = {
    userId: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    onRequestSuccess: PropTypes.func.isRequired,
}

export default CommentCreate