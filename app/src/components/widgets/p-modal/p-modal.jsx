import React from 'react'
import styles from './p-modal.module.css'
import PropTypes from 'prop-types'

/** Components */
import PFab from '../p-fab'
import PLoader from '../p-loader';

const PModal = ({
    onRequestClose,
    onRequestSubmit,
    isLoading,
    type,
    ...props
}) => {

    const actions = () => (
        <div className={styles.actions}> 
            {type === 'submit' && <PFab
                type="submit"
                theme="default"
            >
                <i className="fa fa-check"/>
            </PFab>}
            <PFab
                type="button"
                theme="danger"
                onClick={onRequestClose}
            >
                &#10006;
            </PFab>
        </div>
    )

    const body = () => (
        <div className={styles.modal}>
            <div className={styles.header}>
                {props.header ? props.header : 'Notification'}
            </div>

            <div className={styles.body}>
                {props.children}
            </div>

            {isLoading ? <PLoader /> : actions()}
        </div>
    )

    const render = () => {
        switch (type) {
            case 'submit':
                return (
                    <form onSubmit={onRequestSubmit} className="form">
                        {body()}
                    </form>
                );
            default:
                return body();
        }
    }
    return (
        <div className={styles.wrapper}>
            {render()}
        </div>
    )
};

PModal.propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    onRequestSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
    type: PropTypes.string
}

PModal.defaultProps = {
    type: 'alert',
    isLoading: false
}

export default PModal;