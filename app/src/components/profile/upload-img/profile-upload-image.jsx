import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/** Redux */
import { uploadProfileImg, getProfile } from '../../../store/actions/profileActions';
import { CLEAR_ERRORS } from '../../../store/types.js'

/** Components */
import PModal from '../../widgets/p-modal';
import PLoader from '../../widgets/p-loader';
import FormImage from '../../widgets/form/image';

const ProfileUploadImage = ({
    onRequestClose,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const imgRef = useRef();

    useEffect(() => {
        return () => {
            dispatch({ type: CLEAR_ERRORS });
        };
    }, [])

    const submitHandler = e => {
        if (e) {
            e.preventDefault();
        }
        let img = imgRef.current.files[0];
        if ( ! img) return;
        setIsLoading(true);
        dispatch(uploadProfileImg(img))
            .then(() => {
                dispatch(getProfile());
                setSuccess(true);
                setIsLoading(false)
            })
            .catch(() => setIsError(true));
    }

    const render = () => {
        if (isError) {
            return <div className="italic">Oops Something went wrong.</div>
        }

        if (isSuccess) {
            return <div className="text-success">Image Uploaded Successfully</div>
        }

        if (isLoading) {
            return <PLoader/>
        } else {
            return <FormImage
                name="profile_image"
                refs={imgRef}
                height="128px"
            />
        }
    }

    return (
        <PModal
            type={isSuccess || isLoading || isError ? 'button': 'submit'}
            header="Change Profile Image"
            onRequestSubmit={submitHandler}
            onRequestClose={onRequestClose}>
            {render()}
        </PModal>
    )
}

export default ProfileUploadImage;