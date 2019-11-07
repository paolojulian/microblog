import React, { useState } from 'react';
import classnames from 'classnames';
import styles from './form-image.module.css';
import PropTypes from 'prop-types';

const FormImage = ({
    name,
    refs,
    initSrc,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(initSrc);
    const [imgName, setImgName] = useState('Choose an image');

    const handleChange = () => {
        const reader = new FileReader();
        const img = refs.current.files[0];
        reader.onload = () => {
            setImgSrc(reader.result);
            // setImgName(rea)
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
    }

    return (
        <div className={styles.formImage}>
            {!!imgSrc && <div className={styles.img}>
                <div className={styles.removeImg}
                    onClick={removeImg}
                >
                    &#10006;
                </div>
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
                        ref={refs}
                        onChange={handleChange}
                    />
                    {imgName}
                </label>
            </div>
        </div>
    )
}

FormImage.propTypes = {
    name: PropTypes.string.isRequired,
    initSrc: PropTypes.string
}

FormImage.defaultProps = {
    initSrc: ''
}

export default FormImage;