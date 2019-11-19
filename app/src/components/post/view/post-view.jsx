import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './post-view.module.css';

/** Redux */
import { getPostById } from '../../../store/actions/postActions';

/** Components */
import PLoader from '../../widgets/p-loader';
import PostItem from '../item';
import WithNavbar from '../../hoc/with-navbar';
import InitialStatus from '../../utils/initial-status.js';

const PostView = (props) => {
    const { id } = props.match.params;
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [status, setStatus] = useState(InitialStatus);
    const [post, setPost] = useState({});
    const [profile, setProfile] = useState('');
    const [isShared, setShared] = useState(false);
    /** Only if post is a shared Post */
    const [sharedPost, setSharedPost] = useState({});

    useEffect(() => {
        reloadPost();
    }, [props.match.params]);

    const reloadPost = async () => {
        try {
            setStatus({ ...InitialStatus.LOADING })
            const { Post, isShared, ...response } = await dispatch(getPostById(id));
            setPost(Post.Post);
            setProfile(Post.User);
            setShared(isShared);
            if (isShared) {
                setSharedPost(response.Shared);
            }
            setStatus({ ...InitialStatus.POST })
        } catch (e) {
            setStatus({ ...InitialStatus.ERROR })
        }
    }

    if (status.loading) {
        return <PLoader />
    }

    if (status.error) {
        return <div className="disabled">Oops. Something went wrong</div>
    }

    return (
        <div className={styles.wrapper} key={post.id}>
            <PostItem
                openCommentOnStart={true}
                isShared={isShared}
                sharedPost={isShared ? {
                    userId: Number(sharedPost.Post.user_id),
                    username: sharedPost.User.username,
                    avatarUrl: sharedPost.User.avatar_url,
                    body: sharedPost.Post.body,
                    created: sharedPost.Post.created
                } : null}

                avatarUrl={profile.avatar_url}
                creator={profile.username}

                id={isShared ? Number(sharedPost.Post.id) : Number(post.id)}
                title={post.title}
                body={post.body}
                created={post.created}
                imgPath={post.img_path}
                retweet_post_id={isShared ? sharedPost.Post.id : post.id}
                user_id={Number(post.user_id)}

                likes={isShared ? sharedPost.Post.likes: post.likes}
                comments={isShared ? sharedPost.Post.comments: post.comments}
                loggedin_id={Number(user.id)}
                fetchHandler={reloadPost}
            />
        </div>
    );
}

PostView.propTypes = {
}

PostView.defaultProps = {
}

export default WithNavbar(PostView)
