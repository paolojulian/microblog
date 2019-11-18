import React, { useState } from 'react';
import classnames from 'classnames';
import styles from './form-image.module.css';
import PropTypes from 'prop-types';

/** Components */
import PFab from '../../p-fab';

const FormImage = ({
    name,
    refs,
    initSrc,
    height,
    error,
    onChangeImg,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(initSrc);

    const handleChange = () => {
        const reader = new FileReader();
        const img = refs.current.files[0];
        reader.onload = () => {
            setImgSrc(reader.result);
            onChangeImg();
        };
        if (img) {
            reader.readAsDataURL(img);
        } else {
            setImgSrc('');
        }
    }

    const removeImg = () => {
        refs.current.value = '';
        setImgSrc('');
        if (!!initSrc) {
            onChangeImg();
        }
    }

    return (
        <div className={styles.formImage}>
            {!!imgSrc && <div className={styles.img} style={{
                height: height,
                width: 'auto',
                margin: 'auto',
            }}>
                <PFab
                    theme="secondary"
                    onClick={removeImg}
                    className={styles.removeImg}
                >
                    &#10006;
                </PFab>
                <img
                    src={imgSrc}
                    alt={name}
                    accept="image/png, image/jpeg"
                    {...props}
                    />
            </div>}
            <div className={classnames(styles.input, {
                [styles.inactive]: !!imgSrc
            })}>
                <label>
                    <input type="file"
                        accept="image/png, image/jpeg"
                        ref={refs}
                        onChange={handleChange}
                    />
                    Choose an Image
                </label>
            </div>
            {error && <div className="invalid-feedback">
                {
                    typeof error === 'string'
                        ? `* ${error}`
                        : typeof error[0] === 'string'
                            ? `* ${error[0]}`
                            : ``
                }
            </div>}
        </div>
    )
}

FormImage.propTypes = {
    name: PropTypes.string.isRequired,
    onChangeImg: PropTypes.func.isRequired,
    initSrc: PropTypes.string
}

FormImage.defaultProps = {
    height: '100%',
    initSrc: '',
    onChangeImg: () => {},
    error: ''
}

export default FormImage;