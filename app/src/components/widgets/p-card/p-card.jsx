import React from 'react'
import styles from './p-card.module.css'
import classnames from 'classnames'

const PCard = ({
    header,
    children,
    size,
    className,
    ...props
}) => {

    const mainClasses = classnames(styles.p__card, styles[size]);

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
        <div className={className + ' ' + mainClasses}
            {...props}
        >
            {renderHeader()}
            <div className={styles.body}>
                {children}
            </div>
        </div>
    )
}

export default PCard