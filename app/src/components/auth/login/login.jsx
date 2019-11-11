import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom';

/** Redux */
import { loginUser } from '../../../store/actions/authActions'

/** Components */
import PCard from '../../widgets/p-card'
import PButton from '../../widgets/p-button'
import FormInput from '../../widgets/form/input'

const Login = ({
    loginUser,
    history
}) => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const [isLoading, setLoading] = useState(false);
    const username = useRef('');
    const password = useRef('');
    const [errors, setErrors] = useState({
        form: '',
        username: false,
        password: false
    });

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/')
        }
    });

    const handleSubmit = async e => {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        setLoading(true);
        setErrors({
            form: '',
            username: false,
            password: false
        })
        const User = {
            username: username.current.value,
            password: password.current.value,
        }
        try {
            console.log(await loginUser(User, history));
        } catch (e) {
            if (e.hasOwnProperty('response') && e.response.status === 400) {
                return setErrors({
                    form: e.response.data.message,
                    username: true,
                    password: true
                })
            }
            return setErrors({
                ...errors,
                form: 'Oops. Something went wrong'
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="center-absolute">
            <PCard size="sm">
                <form
                    className="form"
                    onSubmit={handleSubmit}
                >
                    {
                        errors.form && <div className="invalid-feedback">
                            {`* ${errors.form}`}
                        </div>
                    }
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

                    <br />

                    <PButton
                        type="submit"
                        theme="primary"
                        isLoading={isLoading}
                    >
                        SUBMIT
                    </PButton>

                    <Link to="/register">
                        <div className="text-link italic">
                            Create an account?
                        </div>
                    </Link>

                </form>
            </PCard>
        </div>
    )
}

export default connect(null, { loginUser })(withRouter(Login))