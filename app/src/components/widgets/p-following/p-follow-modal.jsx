import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './p-follow.module.css';

/** Redux */
import { fetchFollow } from '../../../store/actions/profileActions';

/** Components */
import PModal from '../../widgets/p-modal';
import PLoader from '../../widgets/p-loader';
import UserItem from '../user';
import ModalScrollPaginate from '../../utils/modal-scroll-paginate';

const availableTypes = ['follower', 'following'];
const PFollowModal = ({
    userId,
    type,
    onRequestClose,
}) => {
    const dispatch = useDispatch();
    const usersRef = useRef('');
    const { id: loggedInUser } = useSelector(state => state.auth.user);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);

    if (availableTypes.indexOf(type) === -1) {
        console.log('Invalid Type Given: ' + type);
        return onRequestClose();
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                await handleFetchFollow();
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const handleFetchFollow = async (page = 1) => {
        try {
            const res = await dispatch(fetchFollow(userId, type, page))
            setUsers([...users, ...res]);
            setPage(page);
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    const renderBody = () => {
        if (isError) return <div className="disabled">Oops. Something went wrong</div>
        if (isLoading) return <PLoader/>
        if ( ! users && users.length === 0) return <div className="disabled">No User/s</div>
        return (
            <ModalScrollPaginate
                page={page}
                fetchHandler={handleFetchFollow}
                className={styles.users}
                bodyRef={usersRef}
            >
                {users.map((item, i) => {
                    let user = type === 'follower' ? item.User : item.Following;
                    return <UserItem
                        key={user.id + i}
                        user={user}
                        showFollow={Number(user.id) !== Number(loggedInUser)}
                        onRequestClose={onRequestClose}
                    />
                })}
            </ModalScrollPaginate>
        )
    }

    return (
        <PModal
            className={styles.modal}
            onRequestClose={onRequestClose}
            header={type === 'follower' ? 'Followers': 'Following'}
        >
            {isLoading ? <PLoader /> : renderBody()}
        </PModal>
    )
};

PFollowModal.propTypes = {
    userId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
}

export default PFollowModal;