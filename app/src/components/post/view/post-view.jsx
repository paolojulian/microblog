import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './post-view.module.css';

/** Redux */
import { getPostById } from '../../../store/actions/postActions';

/** Components */
import PLoader from '../../widgets/p-loader';
import PostItem from '../item';
import WithNavbar from '../../hoc/with-navbar';
import Post from '../../utils/on-scroll-paginate';

const PostView = (props) => {
    const { id } = props.match.params;
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState({});
    const [profile, setProfile] = useState('');
    const [isShared, setShared] = useState(false);
    /** Only if post is a shared Post */
    const [originalPost, setOriginalPost] = useState({});

    useEffect(() => {
        setIsLoading(true);
        reloadPost();
    }, [props.match.params]);

    const reloadPost = () => {
        dispatch(getPostById(id))
            .then(({Post, User, isShared, ...response}) => {
                setPost(Post);
                setProfile(User);
                setShared(isShared);
                if (isShared) {
                    setOriginalPost(response.Original);
                }
            })
            .catch()
            .then(() => setIsLoading(false));
    }

    return (
        isLoading
        ? <PLoader />
        : (
            <div className={styles.wrapper}>
                <PostItem
                    id={post.id}
                    title={isShared ? originalPost.Post.title: post.title}
                    body={isShared ? originalPost.Post.body: post.body}
                    imgPath={isShared ? originalPost.Post.img_path: post.img_path}
                    creator={isShared ? originalPost.User.username : profile.username}
                    originalAvatarUrl={isShared ? originalPost.User.avatar_url: null}
                    shared_body={isShared ? post.body: null}
                    shared_by={isShared ? post.user_id: null}
                    shared_by_username={isShared ? profile.username: null}
                    postUserId={post.user_id}
                    user_id={post.user_id}
                    avatarUrl={profile.avatar_url}
                    created={post.created}
                    isShared={isShared}
                    likes={post.likes}
                    comments={post.comments}
                    loggedin_id={user.id}
                    retweet_post_id={post.retweet_post_id}
                    fetchHandler={() => {}}
                />
            </div>
        )
    );
}

PostView.propTypes = {
}

PostView.defaultProps = {
}

export default WithNavbar(PostView)
