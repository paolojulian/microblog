import React, { useState, useEffect } from 'react'
import styles from './post.module.css'
import { useDispatch } from 'react-redux'

/** Redux */
import { useSelector } from 'react-redux'
import { getPosts } from '../../store/actions/postActions'
import { CLEAR_POSTS } from '../../store/types'

/** Components */
import PostItem from './item'

const Post = () => {
    const dispatch = useDispatch();
    const { list: posts, isLoading } = useSelector(state => state.post)
    const { id } = useSelector(state => state.auth.user)
    const [page, setPage] = useState(1)

    useEffect(() => {
        dispatch(getPosts(page))
        return () => {
            dispatch({ type: CLEAR_POSTS })
        };
    }, [])

    const renderLoader = () => (
        <div>
            <i className="fa fa-spinner fa-pulse"></i>
        </div>
    )

    const renderPosts = () => posts.map(({ Post }, i) => {
        return (
            <PostItem
                key={i}
                id={Post.id}
                title={Post.title}
                body={Post.body}
                likes={Post.likes}
                user_id={Post.user_id}
                creator={Post.username}
                loggedin_id={id}
                created={Post.created}
            />
        )
    })

    return (
        <div className={styles.posts}>
            {isLoading ? renderLoader() : renderPosts()}
        </div>
    )
}

export default Post
