import React, { useRef, useState } from 'react'
import styles from './post-create.module.css'
import { useSelector, connect } from 'react-redux'

/** Redux Actions */
import { addPost } from '../../../store/actions/postActions'

/** Components */
import PCard from '../../widgets/p-card'
import PFab from '../../widgets/p-fab'
import FormInput from '../../widgets/form/input'
import FormTextarea from '../../widgets/form/textarea'

const initialError = {
    title: '',
    body: ''
}

const PostCreate = ({
    addPost,
    ...props
}) => {
    /**
     * Toggler if component will show create post or display
     * a button that will open a create post card
     */
    const [willCreate, setWillCreate] = useState(false)
    const [errors, setErrors] = useState(initialError)
    const title = useRef('')
    const body = useRef('')

    const stateErrors = useSelector(state => state.errors);

    const handleSubmit = e => {
        if (e) {
            e.preventDefault();
        }
        setErrors(initialError)
        const form = {
            title: title.current.value,
            body: body.current.value
        }
        addPost(form)
            .then(() => { closeCreate() })
    }

    const closeCreate = () => {
        setWillCreate(false)
        resetForm()
    }

    const resetForm = () => {
        title.current.value = ''
        body.current.value = ''
    }

    if ( ! willCreate) {
        return (
            <PCard {...props}>
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
        <PCard {...props}>
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

                <br />
                <div className={styles.action_btns}>
                    <PFab
                        type="submit"
                        theme="secondary"
                        className={styles.action_btn}
                    >
                        <i className="fa fa-check"/>
                    </PFab>

                    <PFab theme="accent"
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

export default connect(null, { addPost })(PostCreate)
