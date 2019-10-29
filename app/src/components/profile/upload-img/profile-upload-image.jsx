import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import styles from './profile-upload-image.module.css';

/** Components */
import PModal from '../../widgets/p-modal';
import PButton from '../../widgets/p-button';
import FormImage from '../../widgets/form/image';

const ProfileUploadImage = ({
    user,
    profileImgSrc,
    onRequestClose,
}) => {
    const dispatch = useDispatch();
    const imgRef = useRef();
    const [crop, setCrop] = useState({
        aspect: 16/9,
        unit: 'px',
        width: 50,
        height: 50
    });

    const submitHandler = e => {
        if (e) {
            e.preventDefault();
        }
        console.log(imgRef.current.files[0]);
    }

    return (
        <PModal
            type="submit"
            header="Change Profile Image"
            onRequestSubmit={submitHandler}
            onRequestClose={onRequestClose}>
            <FormImage
                name="profile_image"
                refs={imgRef}
            />
        </PModal>
    )
}

export default ProfileUploadImage;