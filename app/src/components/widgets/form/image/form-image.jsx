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
    onChangeImg,
    ...props
}) => {
    const hasDefault = !!initSrc;
    const [imgSrc, setImgSrc] = useState(initSrc);
    const [imgName, setImgName] = useState('Choose an image');

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
        if (hasDefault) {
            onChangeImg();
        }
    }

    return (
        <div className={styles.formImage}>
            {!!imgSrc && <div className={styles.img} style={{height: height}}>
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
    onChangeImg: PropTypes.func.isRequired,
    initSrc: PropTypes.string
}

FormImage.defaultProps = {
    initSrc: '',
    onChangeImg: () => {}
}

export default FormImage;