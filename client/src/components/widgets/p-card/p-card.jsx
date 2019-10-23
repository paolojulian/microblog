import React from 'react'
import styles from './p-card.module.css'
import classnames from 'classnames'

const PCard = ({
    header,
    children,
    size
}) => {

    const mainClasses = classnames(styles.p__card, {
        [styles.sm]: size === 'sm',
        [styles.lg]: size === 'lg'
    });

    const renderHeader = () => {
        if ( ! header) {
            return null;
        }

        return (
            <div className={styles.header}>
                {header}
            </div>
        )
    }

    return (
        <div className={mainClasses}>
            {renderHeader()}
            <div className={styles.body}>
                {children}
            </div>
        </div>
    )
}

export default PCard