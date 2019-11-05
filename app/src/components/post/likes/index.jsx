import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

/** Redux */
import { fetchLikesByPost } from '../../../store/actions/postActions';

/** Components */
import PModal from '../../widgets/p-modal';
import PLoader from '../../widgets/p-loader';
import UserItem from '../../widgets/user';

const initialStatus = {
    error: false,
    loading: false,
    post: false
}

const LikesModal = ({
    postId,
    onRequestClose
}) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState({...initialStatus})
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const init = async () => {
            setStatus({...initialStatus, loading: true});
            try {
                const data = await dispatch(fetchLikesByPost(postId));
                if ( ! data) throw new Exception();
                setUsers(data);
                setStatus({...initialStatus, post: true});
            } catch (e) {
                setStatus({...initialStatus, error: true});
            }
        }
        init();
    }, [])

    const renderLikes = () => users.map(({ User },  i) =>
        <UserItem
            key={User.id + i}
            user={User}
            onRequestClose={onRequestClose}/>
    );

    const renderError = () => (<div className="disabled">Oops Something went wrong</div>)
    const renderLoading = () => <PLoader/>

    const renderBody = () => {
        if (true === status.error) {
            return renderError();
        }
        if (true === status.loading) {
            return renderLoading();
        }
        if (true === status.post) {
            return renderLikes();
        }
    }

    return (
        <PModal
            header="Likes"
            onRequestClose={onRequestClose}
        >
            {renderBody()}
        </PModal>
    );
};

LikesModal.propTypes = {
    postId: PropTypes.number.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default LikesModal;
