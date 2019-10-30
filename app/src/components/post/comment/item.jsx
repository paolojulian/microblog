import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './post-comment.module.css';

/** Components */
import PCard from '../../widgets/p-card';
import ProfileImage from '../../widgets/profile-image';
import CommentDelete from './delete';

/** Consumers */
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context';

const CommentItem = ({
    id,
    body,
    userId,
    username,
    avatarUrl,
    created,
    reloadPost
}) => {

    const { user: loggedIn } = useSelector(state => state.auth);

    return (
        <PCard size="fit">
            <div className={styles.itemBody}>
                <div className={styles.profileImg}>
                    <ProfileImage
                        size={24}
                        src={avatarUrl}
                    />
                </div>
                <div className="username">
                    <Link to={`/profiles/${username}`}>
                        @{username}&nbsp;
                    </Link>
                </div>
                <div className={styles.bodyText}>
                    {body}
                </div>
                {Number(loggedIn.id) === userId && <ModalConsumer>
                    {({ showModal, hideModal }) => (
                        <div className={styles.deleteBtn}
                            onClick={() => showModal(CommentDelete, {
                                id,
                                onRequestClose: hideModal,
                                onRequestSuccess: reloadPost
                            })}
                        >
                            <i className="fa fa-trash"/>
                        </div>
                    )}
                </ModalConsumer>}
            </div>
        </PCard>
    );
}

CommentItem.propTypes = {
    id: PropTypes.number.isRequired,
    body: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    created: PropTypes.any.isRequired,
    reloadPost: PropTypes.func.isRequired,
}

CommentItem.defaultProps = {
}

export default CommentItem