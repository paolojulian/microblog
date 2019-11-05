import React from 'react';
import PropTypes from 'prop-types';

/** Components */
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context';
import FollowModal from './p-follow-modal';

const PFollowing = ({
    userId,
    totalFollowers,
    totalFollowing
}) => {
    return (
        <ModalConsumer>
            {({ showModal }) => (
            <div style={{
                margin: '1rem 0',
                fontSize: '1.05rem'
            }}>
                <div>
                    <label>Followers: </label>
                    <span style={{
                        color: 'var(--secondary)',
                        cursor: 'pointer'
                    }} onClick={() => showModal(FollowModal, {
                            userId,
                            type: 'follower'
                        })}
                    >
                        {totalFollowers}
                    </span>
                </div>
                <div>
                    <label>Following: </label>
                    <span style={{
                        color: 'var(--secondary)',
                        cursor: 'pointer'
                    }} onClick={() => showModal(FollowModal, {
                            userId,
                            type: 'following'
                        })}
                    >
                        {totalFollowing}
                    </span>
                </div>
            </div>
            )}
        </ModalConsumer>
    )
}

PFollowing.propTypes = {
    userId: PropTypes.number.isRequired,
    totalFollowers: PropTypes.number.isRequired,
    totalFollowing: PropTypes.number.isRequired,
}

export default PFollowing
