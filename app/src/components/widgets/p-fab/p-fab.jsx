import React from 'react'
import styles from './p-fab.module.css'
import classnames from 'classnames'
import PropTypes from 'prop-types';

const PFab = ({
    type,
    theme,
    children,
    className,
    ...props
}) => {

    return (
        <button type={type}
            className={className + " " + classnames(styles.p__fab, {
                [styles.primary]: theme === 'primary',
                [styles.secondary]: theme === 'secondary',
                [styles.accent]: theme === 'accent',
                [styles.danger]: theme === 'danger',
            })}
            {...props}
        >
            {children}
        </button>
    )
}

PFab.propTypes = {
    children: PropTypes.any.isRequired,
    type: PropTypes.string,
    theme: PropTypes.string,
}

PFab.defaultProps = {
    type: 'button'
}

export default PFab