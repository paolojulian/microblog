import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

/** Utils */
import InitialStatus from '../../utils/initial-status';

/** Redux */
import { uploadProfileImg, getProfile } from '../../../store/actions/profileActions';
import { CLEAR_ERRORS } from '../../../store/types.js';

/** Components */
import PModal from '../../widgets/p-modal';
import PLoader from '../../widgets/p-loader';
import FormImage from '../../widgets/form/image';

const ProfileUploadImage = ({
    onRequestClose,
}) => {
    const [status, setStatus] = useState(InitialStatus);
    const [errors, setErrors] = useState({ img: '' })
    const dispatch = useDispatch();
    const imgRef = useRef();

    useEffect(() => {
        return () => {
            dispatch({ type: CLEAR_ERRORS });
        };
    }, [])

    const submitHandler = async (e) => {
        if (e) {
            e.preventDefault();
        }
        let img = imgRef.current.files[0];
        if ( ! img) {
            setErrors({ img: 'Please select an image' })
            return;
        }
        if (img && img.size > 1048576) {
            return setErrors({ img: 'Can only upload up to 1 mb' });
        }
        try {
            setStatus({ ...InitialStatus.LOADING });
            await dispatch(uploadProfileImg(img))
            await dispatch(getProfile());
            setStatus({ ...InitialStatus.POST });
        } catch (e) {
            handleError(e);
        }
    }
    
    const handleError = e => {
        try {
            setStatus({ ...InitialStatus })
            switch(e.response.status) {
                case 413:
                    return setErrors({ img: 'Image size should not exceed 25 mb' })
                case 415:
                    return setErrors({ img: 'File is not supported!' })
                default:
                    throw new Error(e);
            }
        } catch (e) {
            setStatus({ ...InitialStatus.ERROR });
        }
    }

    const render = () => {
        if (status.error) {
            return <div className="disabled">Oops Something went wrong.</div>
        }

        if (status.post) {
            return <div className="text-success">Image Uploaded Successfully</div>
        }

        if (status.loading) {
            return <PLoader/>
        }

        return (
            <div>
                <FormImage
                    name="profile_image"
                    refs={imgRef}
                    height="256px"
                    error={errors.img}
                />
            </div>
        )
    }

    return (
        <PModal
            type={status.post || status.loading || status.error ? 'button': 'submit'}
            header="Change Profile Image"
            onRequestSubmit={submitHandler}
            onRequestClose={onRequestClose}>
            {render()}
        </PModal>
    )
}

export default ProfileUploadImage;