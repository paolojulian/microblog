import React from 'react';
import styles from './form-textarea.module.css';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const FormTextArea = ({
    name,
    placeholder,
    refs,
    error,
    info,
    type,
    disabled,
    theme,
    rows,
    ...props
}) => {
    return (
        <div className={styles.form_textarea}>
            <textarea
                className={classnames(styles.input, {
                    'is-invalid': error,
                    [styles.theme_default]: theme === 'default' && !error,
                    [styles.theme_primary]: theme === 'primary' && !error,
                    [styles.theme_secondary]: theme === 'secondary' && !error,
                })}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                ref={refs}
                rows={rows}
                {...props}
            ></textarea>
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

FormTextArea.propTypes = {
    name: PropTypes.string.isRequired,

    placeholder: PropTypes.string,
    info: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.any,
    disabled: PropTypes.bool,
    theme: PropTypes.string,
    rows: PropTypes.number
}

FormTextArea.defaultProps = {
    type: 'text',
    theme: 'default',
    refs: null,
    rows: 4
}

export default FormTextArea;