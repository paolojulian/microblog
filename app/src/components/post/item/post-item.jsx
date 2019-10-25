import React, { useRef, useState } from 'react'
import styles from './post.module.css'

/** Components */
import PCard from '../widgets/p-card'
import PFab from '../widgets/p-fab'
import FormInput from '../widgets/form/input'
import FormTextarea from '../widgets/form/textarea'

const initialError = {
    title: '',
    body: ''
}

const Post = ({
    ...props
}) => {
    /**
     * Toggler if component will show create post or display
     * a button that will open a create post card
     */
    const [willCreate, setWillCreate] = useState(false)
    const [errors, setErrors] = useState(initialError)

    return (
        <PCard {...props}>
        </PCard>
    )
}

export default Post
