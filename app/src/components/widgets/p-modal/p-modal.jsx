import React from 'react'
import styles from './p-modal.module.css'

/** Components */
import PFab from '../p-fab'

const PModal = ({
    onRequestClose,
    type,
    ...props
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.modal}>

                <div className={styles.header}>
                    {props.header ? props.header : 'Notification'}
                </div>

                <div className={styles.body}>
                    {props.children}
                </div>

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

            </div>
        </div>
    )
};

export default PModal;