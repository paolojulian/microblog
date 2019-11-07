import React, { useEffect, useState, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { connect, useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom';

/** Redux Actions */
import { registerUser } from '../../../store/actions/authActions'
import { CLEAR_ERRORS } from '../../../store/types.js'

/** Components */
import PCard from '../../widgets/p-card'
import PButton from '../../widgets/p-button'
import FormInput from '../../widgets/form/input'

/** Context */
import { ModalContext } from '../../widgets/p-modal/p-modal-context'

const Register = ({
    registerUser,
    history
}) => {
    const dispatch = useDispatch();
    const context = useContext(ModalContext);
    const stateErrors = useSelector(state => state.errors);
    const [isLoading, setLoading] = useState(false);
    const first_name = useRef('');
    const last_name = useRef('');
    const email = useRef('');
    const birthdate = useRef('');
    const [sex, setSex] = useState('');
    const username = useRef('');
    const password = useRef('');
    const confirm_password = useRef('');
    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        birthdate: '',
        sex: '',
        username: '',
        password: '',
        confirm_password: '',
    });

    useEffect(() => {
        return () => {
            dispatch({ type: CLEAR_ERRORS })
        }
    }, [])

    useEffect(() => {
        if (stateErrors) {
            setErrors(stateErrors)
        }
    }, [stateErrors])

    const handleSubmit = async e => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        setLoading(true);
        const User = {
            first_name: first_name.current.value,
            last_name: last_name.current.value,
            email: email.current.value,
            birthdate: birthdate.current.value,
            sex: sex,
            username: username.current.value,
            password: password.current.value,
            confirm_password: confirm_password.current.value,
        }
        try {
            await registerUser(User, history)
            context.notify.success(
                `Account created successfully,
                \n
                please check your email for an activation link`
            );
            history.push('/login');

        } catch (e) {
            if (
                !!e.response &&
                !!e.response.status &&
                e.response.status !== 422
            ) {
                context.notify.danger(`
                    There was a problem in creating your account,
                    \n
                    Please try again later
                `);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="center-absolute">
            <PCard size="sm"
                header="Create an Account"
            >
                <form
                    className="form"
                    onSubmit={handleSubmit}
                >
                    <FormInput
                        placeholder="First Name"
                        name="first_name"
                        refs={first_name}
                        error={errors.first_name}
                    />
                    <FormInput
                        placeholder="Last Name"
                        name="last_name"
                        refs={last_name}
                        error={errors.last_name}
                    />
                    <FormInput
                        type="email"
                        placeholder="Email"
                        name="email"
                        refs={email}
                        error={errors.email}
                    />
                    <FormInput
                        type="date"
                        placeholder="Birthdate"
                        name="birthdate"
                        refs={birthdate}
                        error={errors.birthdate}
                    />

                    <input
                        type="radio"
                        value="M"
                        name="sex"
                        onChange={() => setSex('M')}
                    />
                    M
                    <input
                        type="radio"
                        value="F"
                        name="sex"
                        onChange={() => setSex('F')}
                    />
                    F

                    <FormInput
                        placeholder="Username"
                        name="username"
                        refs={username}
                        error={errors.username}
                    />
                    <FormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        refs={password}
                        error={errors.password}
                    />
                    <FormInput
                        type="password"
                        placeholder="Confirm Password"
                        name="password"
                        refs={confirm_password}
                        error={errors.confirm_password}
                    />

                    <br />

                    <PButton
                        type="submit"
                        theme="primary"
                        isLoading={isLoading}
                    >
                        SUBMIT
                    </PButton>
                    <div className="text-link italic">
                        <Link to="/login">
                            Already have an account?
                        </Link>
                    </div>
                </form>
            </PCard>
        </div>
    )
}

export default connect(null, { registerUser })(withRouter(Register))