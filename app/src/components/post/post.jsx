import React, { useState, useEffect, createRef } from 'react'
import styles from './post.module.css'

/** Redux */
import { useSelector } from 'react-redux'

/** Components */
import PostItem from './item'
import PLoader from '../widgets/p-loader'

const Post = ({ fetchHandler }) => {
    const postsRef = createRef();
    const { list: posts, isLoading: postLoading } = useSelector(state => state.post)
    const { id } = useSelector(state => state.auth.user)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false);
    const [isLast, setIsLast] = useState(false);

    useEffect(() => {
        if ( ! isLast) {
            window.addEventListener('scroll', listenOnScroll);
        } else {
            window.removeEventListener('scroll', listenOnScroll);
        }
        return () => {
            window.removeEventListener('scroll', listenOnScroll);
        };
    }, [isLoading, page, isLast])

    const handleScrollDown = async (n = 1) => {
        try {
            const res = await fetchHandler(n);
            console.log(res.length);
            if (res.length > 0) {
                setPage(n);
            } else {
                setIsLast(true);
            }
            return Promise.resolve();
        } catch (e) {
            if (page > 1) {
                setPage(page - 1);
            }
        }
    }

    const listenOnScroll = () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            if (isLast) return;
            if ( ! isLoading) {
                setIsLoading(true)
                handleScrollDown(page + 1)
                    .then(() => setIsLoading(false));
            }
        }
    }

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
            {!!postLoading && <PLoader/>}
        </div>
    )
}

export default Post
