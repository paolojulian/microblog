import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './profile-update.module.css';

/** Redux */
import { getProfile, updateProfile } from '../../../store/actions/profileActions';
import { CLEAR_ERRORS } from '../../../store/types.js'

/** Components */
import WithNavbar from '../../hoc/with-navbar';
import PLoader from '../../widgets/p-loader';
import PCard from '../../widgets/p-card';
import PButton from '../../widgets/p-button';
import ProfileImage from '../../widgets/profile-image';
import FormInput from '../../widgets/form/input';
import ProfileUploadImage from '../upload-img';
import ServerError from '../../widgets/server-error';

/** Consumer */
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context'

const ProfileUpdate = () => {
    const dispatch = useDispatch();
    // Form
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [profileImgSrc, setProfileImgSrc] = useState(null);
    const { user, loading } = useSelector(state => state.profile);
    const { errors } = useSelector(state => state);
    const [isLoading, setLoading] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const [serverError, setServerError] = useState(false);

    let successTimeout = null;
    let errorTimeout = null;

    useEffect(() => {
        dispatch(getProfile())
        return () => {
            clearTimeout(successTimeout);
        }
    }, []);

    useEffect(() => {
        if ( ! loading) {
            setUsername(user.username);
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
            setBirthdate(user.birthdate);
            try {
                const src = `/app/webroot/img/profiles/${user.id}/${user.username}.png`;
                require(`../../../../webroot/img/profiles/${user.id}/${user.username}.png`);
                setProfileImgSrc(src);
            } catch (e) {
                setProfileImgSrc(null);
            }
        }
    }, [loading])

    const submitHandler = async e => {
        if (e) {
            e.preventDefault();
        }
        setLoading(true);
        setServerError(false);
        let form = {
            username,
            first_name: firstName,
            last_name: lastName,
            // email,
            birthdate
        };
        if (oldPassword) {
            form.password = password;
            form.old_password = oldPassword;
            form.confirm_password = confirmPassword;
        }
        try {
            await dispatch(updateProfile(form))
            handleSuccess();
        } catch (e) {
            handleError(e);
        } finally {
            setLoading(false);
        }
    }

    const handleSuccess = () => {
        clearTimeout(successTimeout);
        dispatch(getProfile());
        setSuccess(true)
        dispatch({ type: CLEAR_ERRORS });
        successTimeout = setTimeout(() => {
            setSuccess(false)
        }, 5000)
    }

    const handleError = (e) => {
        clearTimeout(errorTimeout);
        setSuccess(false)
        if ( ! e || ! e.request || e.request.status !== 422) {
            setServerError(true);
        }
        setTimeout(() => {
            setServerError(false);
            dispatch({ type: CLEAR_ERRORS });
        }, 5000);
    }

    const renderBody = () => (
        <div className={styles.profile}>
            <div className={styles.profileImg}>
                <ModalConsumer>
                    {({ showModal }) => (
                        <div className={styles.profileImgOverlay}
                            onClick={() => showModal(ProfileUploadImage, {
                                user,
                                profileImgSrc,
                            })}
                        >
                            Update
                        </div>
                    )}
                </ModalConsumer>
                <ProfileImage
                    src={user.avatar_url}
                    alt={user.username}
                />
            </div>
            <form 
                className="form"
                onSubmit={submitHandler}
            >
                <FormInput
                    placeholder="Username"
                    name="username"
                    info="A unique handler for your profile"
                    error={errors.username}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <FormInput
                    placeholder="First Name"
                    name="first_name"
                    error={errors.first_name}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
                <FormInput
                    placeholder="Last Name"
                    name="last_name"
                    error={errors.last_name}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />
                {/* <FormInput
                    type="email"
                    placeholder="Email"
                    name="email"
                    error={errors.email}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                /> */}

                <FormInput
                    type="date"
                    placeholder="Birthdate"
                    name="birthdate"
                    error={errors.birthdate}
                    value={birthdate}
                    onChange={e => setBirthdate(e.target.value)}
                />

                <FormInput
                    type="password"
                    placeholder="Old Password"
                    name="old_password"
                    error={errors.old_password}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                />

                {!!oldPassword && <FormInput
                    type="password"
                    placeholder="New Password"
                    name="password"
                    error={errors.password}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />}

                {!!oldPassword && <FormInput
                    type="password"
                    placeholder="Confirm Password"
                    name="confirm_password"
                    error={errors.confirm_password}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />}

                {serverError ? <ServerError/> : ''}
                {isSuccess ? (<div className="text-success">Profile successfully updated!</div>) : ''}

                <PButton
                    type="submit"
                    theme="primary"
                    isLoading={isLoading}
                >
                    UPDATE
                </PButton>

            </form>
        </div>
    )

    return (
        <div className={styles.container}>
            <PCard
                size="fit"
                header="EDIT PROFILE"
            >
                {loading ? <PLoader/>: renderBody()}
            </PCard>
        </div>
    )
}

export default WithNavbar(ProfileUpdate)