import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/** Redux */
import { CLEAR_ERRORS } from '../../../store/types';
import { sharePost } from '../../../store/actions/postActions';

/** Utils */
import InitialStatus from '../../utils/initial-status';

/** Components */
import PModal from '../../widgets/p-modal';
import FormTextArea from '../../widgets/form/textarea/form-textarea';

const PostShare = ({
    id,
    creator,
    onRequestClose,
    onSuccess,
    ...props
}) => {

    const [status, setStatus] = useState(InitialStatus);
    const errors = useSelector(state => state.errors);
    const bodyRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch({ type: CLEAR_ERRORS })
        };
    }, [])

    const handleShare = async (e) => {
        if (e) {
            e.preventDefault();
        }
        if (status.loading) return false;
        try {
            setStatus({ ...InitialStatus, loading: true });
            await dispatch(sharePost(id, bodyRef.current.value))
            onSuccess();
            setStatus({ ...InitialStatus, post: true });
        } catch (e) {
            if (e.response.status !== 422) {
                setStatus({ ...InitialStatus, error: true });
            } else {
                setStatus({ ...InitialStatus });
            }
        }
    }

    if (status.error) {
        return (
            <PModal onRequestClose={onRequestClose}>
                <div className="disabled">Oops. something went wrong</div>
            </PModal>
        )
    }

    if (status.post) {
        return (
            <PModal onRequestClose={onRequestClose}>
                You successfully shared @{creator}'s post 
            </PModal>
        )
    }

    return (
        <PModal type="submit"
            onRequestSubmit={handleShare}
            isLoading={status.loading}
            onRequestClose={onRequestClose}
            header={`Share ${creator}'s post`}
        >
            <FormTextArea 
                placeholder="Body"
                name="body"
                refs={bodyRef}
                info="Say something about the post (Optional)"
                error={errors.body}
            />
        </PModal>
    )
};

export default PostShare;