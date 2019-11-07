import React, { useRef, useState, useEffect, useContext } from 'react'
import styles from './post-create.module.css'
import { useDispatch, useSelector, connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

/** Redux Actions */
import { CLEAR_ERRORS } from '../../../store/types'
import { addPost } from '../../../store/actions/postActions'

/** Components */
import PCard from '../../widgets/p-card'
import PFab from '../../widgets/p-fab'
import FormInput from '../../widgets/form/input'
import FormTextarea from '../../widgets/form/textarea'
import FormImage from '../../widgets/form/image'

/** Context */
import { ModalContext } from '../../widgets/p-modal/p-modal-context'

const initialError = {
    title: '',
    body: ''
}

const PostCreate = ({
    addPost,
    ...props
}) => {
    const dispatch = useDispatch()
    const context = useContext(ModalContext);
    const stateErrors = useSelector(state => state.errors)
    /**
     * Toggler if component will show create post or display
     * a button that will open a create post card
     */
    const [willCreate, setWillCreate] = useState(false)
    const [errors, setErrors] = useState({ ...initialError })
    const title = useRef('')
    const body = useRef('')
    const img = useRef('')

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

    const handleSubmit = e => {
        if (e) {
            e.preventDefault();
        }
        setErrors(initialError)
        const form = {
            title: title.current.value,
            body: body.current.value,
            img: img.current.files[0]
        }
        addPost(form, props.history)
            .then(handleSuccess)
    }

    const handleSuccess = () => {
        context.notify.success('Your post was successfully created!');
        closeCreate()
    }

    const closeCreate = () => {
        setWillCreate(false)
        dispatch({ type: CLEAR_ERRORS })
    }

    if ( ! willCreate) {
        return (
            <PCard>
                <span className="text-link italic"
                    onClick={() => setWillCreate(true)}
                >
                    Write a post&nbsp;
                    <i className="fa fa-edit"/>
                </span>
            </PCard>
        )
    }

    return (
        <PCard>
            <span className="text-link italic"
                onClick={closeCreate}
            >
                Write a post&nbsp;
                <i className="fa fa-edit"/>
            </span>
            <form
                className="form"
                onSubmit={handleSubmit}
            >
                <FormInput
                    placeholder="Title"
                    name="title"
                    refs={title}
                    error={errors.title}
                />
                <FormTextarea
                    placeholder="Body"
                    name="body"
                    refs={body}
                    error={errors.body}
                />

                <FormImage
                    name="profile_image"
                    refs={img}
                />

                <br />
                <div className={styles.action_btns}>
                    <PFab
                        type="submit"
                        theme="primary"
                        className={styles.action_btn}
                    >
                        <i className="fa fa-check"/>
                    </PFab>

                    <PFab
                        theme="secondary"
                        onClick={() => closeCreate()}
                        className={styles.action_btn}
                    >
                        &#10006;
                    </PFab>
                </div>

            </form>
        </PCard>
    )
}

export default connect(null, { addPost })(withRouter(PostCreate))
