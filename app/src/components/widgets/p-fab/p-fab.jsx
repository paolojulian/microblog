import React from 'react'
import styles from './p-fab.module.css'
import classnames from 'classnames'
import PropTypes from 'prop-types';

const PButton = ({
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

PButton.propTypes = {
    children: PropTypes.any.isRequired,
    type: PropTypes.string,
    theme: PropTypes.string,
}

PButton.defaultProps = {
    type: 'button'
}

export default PButton