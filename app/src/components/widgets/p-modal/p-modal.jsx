import React from 'react'
import styles from './p-modal.module.css'
import classnames from 'classnames'
import PropTypes from 'prop-types';

const types = ['submit', 'alert'];

/** Components */
import PFab from '../p-fab'

const PModal = ({
    type,
    theme,
    ...props
}) => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.modal}>
                {!!props.header && <div className={styles.header}>
                    {props.header}
                </div>}
                <div className={styles.body}>
                    {props.children}
                </div>
                {type === 'submit' && <div className={styles.actions}>
                    <PFab
                        type="submit"
                        theme="primary"
                    >
                        <i className="fa fa-check"/>
                    </PFab>
                </div>}
            </div>
        </div>
    )
}

PModal.propTypes = {
    children: PropTypes.any.isRequired,
    type: PropTypes.string,
    theme: PropTypes.string,
}

PModal.defaultProps = {
    type: 'alert',
    theme: 'default'
}

export default PModal