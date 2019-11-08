import React, { useState } from 'react'
import styles from './post.module.css'

/** Redux */
import { useSelector } from 'react-redux'

/** Components */
import PostItem from './item'
import OnScrollPaginate from '../utils/on-scroll-paginate'
import PCard from '../widgets/p-card/p-card'

const Post = ({ fetchHandler }) => {
    const { list: posts, page } = useSelector(state => state.post)
    const { id } = useSelector(state => state.auth.user)
    
    const renderPosts = () => posts.map(({ Post }, i) => {
        return (
            <PostItem
                key={Post.id}
                id={Post.id}
                avatarUrl={Post.avatar_url}
                body={Post.body}
                comments={Post.comments}
                created={Post.created}
                creator={Post.username}
                fetchHandler={fetchHandler}
                imgPath={Post.img_path}
                isShared={!!Post.shared_by && !!Post.shared_by_username}
                likes={Post.likes}
                loggedin_id={id}
                ownerId={Post.shared_by ? Post.shared_by : Post.user_id}
                retweet_post_id={Post.retweet_post_id}
                shared_by={Post.shared_by}
                shared_by_username={Post.shared_by_username}
                title={Post.title}
                user_id={Post.user_id}
            />
        )
    })

    const renderEmpty = () => (
        <PCard size="fit" style={{marginTop: '0.5rem'}}>
            <div className="disabled">No Post/s to show</div>
        </PCard>
    )

    return (
        <OnScrollPaginate
            className={styles.posts}
            id="posts"
            fetchHandler={fetchHandler}
            page={page}
        >
            {!posts || posts.length === 0 ? renderEmpty() : renderPosts()}
        </OnScrollPaginate>
    )
}

export default Post
