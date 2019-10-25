import React from 'react'
import styles from './post.module.css'

/** Components */
import PostItem from './item'

const initialError = {
    title: '',
    body: ''
}

const Post = ({
    ...props
}) => {

    return (
        <PCard {...props}>
        </PCard>
    )
}

export default Post
