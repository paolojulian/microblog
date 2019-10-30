import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './profile-update.module.css';

/** Redux */
import { getProfile, updateProfile } from '../../../store/actions/profileActions';

/** Components */
import WithNavbar from '../../hoc/with-navbar';
import PLoader from '../../widgets/p-loader';
import PCard from '../../widgets/p-card';
import PButton from '../../widgets/p-button';
import ProfileImage from '../../widgets/profile-image';
import FormInput from '../../widgets/form/input';
import ProfileUploadImage from '../upload-img';

/** Consumer */
import { ModalConsumer } from '../../widgets/p-modal/p-modal-context'

const ProfileUpdate = () => {
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [profileImgSrc, setProfileImgSrc] = useState(null);
    const { user, loading } = useSelector(state => state.profile);
    const { errors } = useSelector(state => state);

    useEffect(() => {
        dispatch(getProfile())
    }, []);

    useEffect(() => {
        if ( ! loading) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
            setBirthdate(user.birthdate);
            try {
                const src = `/app/webroot/img/profiles/${user.id}/${user.username}.png`;
                require(`../../../../webroot/img/profiles/${user.id}/${user.username}.png`);
                setProfileImgSrc(src);
            } catch (e) {
                console.error(e);
                setProfileImgSrc(null);
            }
        }
    }, [loading])

    const submitHandler = e => {
        if (e) {
            e.preventDefault();
        }
        const form = {
            first_name: firstName,
            last_name: lastName,
            email,
            birthdate
        }
        dispatch(updateProfile(form));
    }

    const renderBody = () => (
        <div className={styles.profile}>
            <div className={styles.profileImg}>
                <ModalConsumer>
                    {({ showModal }) => (
                        <div className={styles.profileImgOverlay}
                            onClick={() => showModal(ProfileUploadImage, { user, profileImgSrc })}
                        >
                            Edit Image
                        </div>
                    )}
                </ModalConsumer>
                <ProfileImage
                    src={`${user.id}/${user.username}x128.png`}
                    alt={user.username}
                />
            </div>
            <form 
                className="form"
                onSubmit={submitHandler}
            >
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
                <FormInput
                    type="email"
                    placeholder="Email"
                    name="email"
                    error={errors.email}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <FormInput
                    type="date"
                    placeholder="Birthdate"
                    name="birthdate"
                    error={errors.birthdate}
                    value={birthdate}
                    onChange={e => setBirthdate(e.target.value)}
                />

                <PButton
                    type="submit"
                    theme="primary"
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