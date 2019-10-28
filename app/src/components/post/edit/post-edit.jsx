import React, { useState, useEffect } from 'react'
import styles from './post-edit.module.css'
import { useDispatch, useSelector, connect } from 'react-redux'

/** Redux Actions */
import { CLEAR_ERRORS } from '../../../store/types'
import { editPost } from '../../../store/actions/postActions'

/** Components */
import PFab from '../../widgets/p-fab'
import FormInput from '../../widgets/form/input'
import FormTextarea from '../../widgets/form/textarea'

// const initialError = {
//     title: '',
//     body: ''
// }

const PostEdit = ({
    editPost,
    id,
    onSuccess,
    ...props
}) => {
    const dispatch = useDispatch()
    const { errors } = useSelector(state => state)
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);

    useEffect(() => {
        return () => {
            dispatch({ type: CLEAR_ERRORS })
        }
    }, [])

    const handleSubmit = e => {
        if (e) {
            e.preventDefault();
        }
        const form = {
            title,
            body
        }
        editPost(id, form)
            .then(() => { close() })
    }

    const close = () => {
        dispatch({ type: CLEAR_ERRORS });
        onSuccess();
    }

    return (
        <form
            className="form"
            onSubmit={handleSubmit}
        >
            <FormInput
                placeholder="Title"
                name="title"
                error={errors.title}
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <FormTextarea
                placeholder="Body"
                name="body"
                error={errors.body}
                value={body}
                onChange={e => setBody(e.target.value)}
            />
            <div className={styles.actions}>
                <PFab
                    type="submit"
                    theme="default"
                >
                    <i className="fa fa-check"/>
                </PFab>
                <PFab
                    type="button"
                    theme="danger"
                    onClick={() => close()}
                >
                    &#10006;
                </PFab>
            </div>
        </form>
    )
}

export default connect(null, { editPost })(PostEdit)
