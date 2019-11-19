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
        const sharedPost = {
            userId: Number(Post.shared_user_id),
            username: Post.shared_username,
            avatarUrl: Post.shared_avatar_url,
            body: Post.shared_body,
            created: Post.shared_created
        }
        return (
            <div key={Post.id}>
                <PostItem
                    isShared={!!Post.is_shared}
                    sharedPost={sharedPost}
                    id={Number(Post.id)}
                    avatarUrl={Post.avatar_url}
                    title={Post.title}
                    body={Post.body}
                    created={Post.created}
                    creator={Post.username}
                    imgPath={Post.img_path}
                    retweet_post_id={Number(Post.retweet_post_id)}
                    user_id={Number(Post.user_id)}

                    likes={Post.likes}
                    comments={Post.comments}
                    loggedin_id={Number(id)}
                    fetchHandler={fetchHandler}
                />
            </div>
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
