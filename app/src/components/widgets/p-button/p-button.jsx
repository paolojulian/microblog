import React from 'react'
import styles from './p-button.module.css'
import classnames from 'classnames'
import PropTypes from 'prop-types';

const PButton = ({
    type,
    theme,
    children,
    isLoading,
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
            {isLoading ? <i className="fa fa-spinner fa-spin"/> : children}
        </button>
    )
}

PButton.propTypes = {
    children: PropTypes.any.isRequired,
    type: PropTypes.string,
    theme: PropTypes.string,
    isLoading: PropTypes.bool
}

PButton.defaultProps = {
    type: 'button',
    isLoading: false
}

export default PButton