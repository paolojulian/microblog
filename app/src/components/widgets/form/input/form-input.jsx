import React from 'react';
import styles from './form-input.module.css';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const FormInput = ({
    name,
    placeholder,
    refs,
    error,
    info,
    type,
    disabled,
    theme,
    ...props
}) => {
    return (
        <div className={styles.form_input}>
            <input
                className={classnames(styles.input, {
                    'is-invalid': error,
                    [styles.theme_default]: theme === 'default' && !error,
                    [styles.theme_primary]: theme === 'primary' && !error,
                    [styles.theme_secondary]: theme === 'secondary' && !error,
                })}
                type={type}
                name={name}
                placeholder={placeholder}
                ref={refs}
                disabled={disabled}
                {...props}
                />
            {info && <small className="form-info">{info}</small>}
            {
                error && <div className="invalid-feedback">
                    {
                        typeof error === 'string'
                            ? `* ${error}`
                            : typeof error[0] === 'string'
                                ? `* ${error[0]}`
                                : ``
                    }
                </div>
            }
        </div>
    )
}

FormInput.propTypes = {
    name: PropTypes.string.isRequired,

    placeholder: PropTypes.string,
    info: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.any,
    disabled: PropTypes.bool,
    theme: PropTypes.string,
}

FormInput.defaultProps = {
    type: 'text',
    theme: 'default',
    refs: null
}

export default FormInput;