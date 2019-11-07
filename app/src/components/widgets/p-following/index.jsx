import React from 'react';
import PropTypes from 'prop-types';

/** Components */
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context';
import FollowModal from './p-follow-modal';

const style = {
    label: {
        backgroundColor: 'var(--primary-dark)',
        color: 'var(--grey)',
        padding: '0.1rem 0.5rem',
        fontSize: '0.9rem',
        borderTopLeftRadius: '5px',
        borderBottomLeftRadius: '5px',
        cursor: 'pointer'
    },
    number: {
        backgroundColor: 'var(--primary)',
        color: 'var(--grey)',
        padding: '0.1rem 0.5rem',
        fontSize: '0.9rem',
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px',
        cursor: 'pointer'
    }
}

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
                <div style={{margin: '0.5rem 0', cursor: 'pointer'}}
                    onClick={() => showModal(FollowModal, {
                        userId,
                        type: 'follower'
                    })}
                >
                    <label style={style.label}>Followers:&nbsp;</label>
                    <span style={style.number}>
                        {totalFollowers}
                    </span>
                </div>
                <div onClick={() => showModal(FollowModal, {
                        userId,
                        type: 'following'
                    })}
                    style={{cursor: 'pointer'}}>
                    <label style={style.label}>
                        Following:&nbsp;
                    </label>
                    <span style={style.number}>
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
