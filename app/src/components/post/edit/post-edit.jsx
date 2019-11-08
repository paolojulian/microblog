import React, { useRef, useState, useEffect, useContext } from 'react'
import styles from './post-edit.module.css'
import { useDispatch, useSelector, connect } from 'react-redux'

/** Redux Actions */
import { CLEAR_ERRORS } from '../../../store/types'
import { editPost } from '../../../store/actions/postActions'

/** Components */
import PFab from '../../widgets/p-fab'
import FormInput from '../../widgets/form/input'
import FormTextarea from '../../widgets/form/textarea'
import FormImage from '../../widgets/form/image'

/** Context */
import { ModalContext } from '../../widgets/p-modal/p-modal-context'

const PostEdit = ({
    editPost,
    id,
    onSuccess,
    ...props
}) => {

    const dispatch = useDispatch()
    const context = useContext(ModalContext)
    const { errors } = useSelector(state => state)
    const imgRef = useRef()
    const [didChangeImg, setDidChangeImg] = useState(false);
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
        let form = {
            title,
            body,
        }
        if (didChangeImg) {
            form.img = imgRef.current.files[0]
        }
        editPost(id, form)
            .then(() => {
                context.notify.success("Updated Successfully!");
                close()
            })
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

            <FormImage
                name="profile_image"
                refs={imgRef}
                initSrc={props.imgPath ? props.imgPath + 'x256.png' : ''}
                onChangeImg={() => setDidChangeImg(true)}
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
