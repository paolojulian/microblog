import React from 'react'
import styles from './p-button.module.css'
import classnames from 'classnames'
import PropTypes from 'prop-types';

const PButton = ({
    type,
    theme,
    children,
    ...props
}) => {

    return (
        <button type={type}
            {...props}
            className={classnames(styles.p__button, {
                [styles.primary]: theme === 'primary',
                [styles.secondary]: theme === 'secondary',
                [styles.accent]: theme === 'accent',
                [styles.danger]: theme === 'danger',
            })}
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