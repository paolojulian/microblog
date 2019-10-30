import React, { createRef } from 'react'
import styles from './post.module.css'

/** Redux */
import { useSelector } from 'react-redux'

/** Components */
import PostItem from './item'
import PLoader from '../widgets/p-loader'

const Post = ({ fetchHandler }) => {
    const postsRef = createRef();
    const { list: posts, isLoading } = useSelector(state => state.post)
    const { id } = useSelector(state => state.auth.user)

    const renderPosts = () => posts.map(({ Post }, i) => {
        return (
            <PostItem
                key={Post.id}
                id={Post.id}
                title={Post.title}
                body={Post.body}
                likes={Post.likes}
                comments={Post.comments}
                user_id={Post.user_id}
                creator={Post.username}
                avatarUrl={Post.avatar_url}
                ownerId={Post.shared_by ? Post.shared_by : Post.user_id}
                imageName={Post.shared_by_username ? Post.shared_by_username : Post.username}
                shared_by={Post.shared_by}
                shared_by_username={Post.shared_by_username}
                loggedin_id={id}
                created={Post.created}
                fetchHandler={fetchHandler}
            />
        )
    })

    return (
        <div className={styles.posts}
            id="posts"
            ref={postsRef}
        >
            {renderPosts()}
            {!!isLoading && <PLoader/>}
        </div>
    )
}

export default Post
