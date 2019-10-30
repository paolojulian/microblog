import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './post-view.module.css';

/** Redux */
import { getPostById } from '../../../store/actions/postActions';

/** Components */
import PLoader from '../../widgets/p-loader';
import PostItem from '../item';
import PostComment from '../comment';
import CommentCreate from '../comment/create';
import WithNavbar from '../../hoc/with-navbar';

const PostView = (props) => {
    const { id } = props.match.params;
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState({});
    const [profile, setProfile] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        reloadPost();
    }, []);

    const reloadPost = () => {
        dispatch(getPostById(id))
            .then(({Comments, Post, User}) => {
                setPost(Post);
                setComments(Comments);
                setProfile(User);
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
                    title={post.title}
                    body={post.body}
                    user_id={post.user_id}
                    avatarUrl={profile.avatar_url}
                    creator={profile.username}
                    created={post.created}
                    likes={post.likes}
                    comments={post.comments}
                    loggedin_id={user.id}
                    fetchHandler={() => {}}
                />
                <div className={styles.createComment}>
                    <CommentCreate
                        postId={Number(post.id)}
                        userId={Number(user.id)}
                        onRequestSuccess={reloadPost}
                    />
                </div>
                <div className={styles.comments}>
                    <PostComment
                        comments={comments}
                        reloadPost={reloadPost}
                    />
                </div>
            </div>
        )
    );
}

PostView.propTypes = {
}

PostView.defaultProps = {
}

export default WithNavbar(PostView)
