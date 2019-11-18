import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './post-item.module.css';

/** Utils */
import initialStatus from '../../utils/initial-status';

/** Redux */
import { getCommentsByPost } from '../../../store/actions/postActions';

/** Components */
import CommentCreate from '../comment/create';
import PostComment from '../comment';
import PLoader from '../../widgets/p-loader';
import LoadMore from '../../widgets/load-more';

const PostComments = ({
    postId,
    onUpdateCommentCount,
    onRequestClose,
    onRequestSuccessCreate
}) => {

    const dispatch = useDispatch();
    const { user: loggedIn } = useSelector(state => state.auth);
    const [status, setStatus] = useState(initialStatus);
    const [comments, setComments] = useState([]);
    const [totalLeft, setTotalLeft] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getComments();
    }, [])

    const getComments = async(pageNo = 1) => {
        try {
            setStatus({ ...initialStatus, loading: true })
            const res = await dispatch(getCommentsByPost(postId, pageNo))
            if (pageNo === 1) {
                setComments(res.list)
            } else {
                setComments([...comments, ...res.list])
            }
            setTotalLeft(res.totalLeft);
            onUpdateCommentCount(Number(res.totalCount));
            setPage(pageNo);
            setStatus({ ...initialStatus, post: true })
        } catch (e) {
            setStatus({ ...initialStatus, error: true })
        }
    }

    const renderStatus = () => {
        if (status.error) {
            return <div className="disabled">Oops. Something went wrong</div>
        }

        if (status.loading) {
            return <PLoader />
        }
        return ''
    }

    return (
        <div className={styles.postComments}>
            <CommentCreate
                postId={Number(postId)}
                userId={Number(loggedIn.id)}
                onRequestSuccess={(data) => {
                    getComments(1)
                    onRequestSuccessCreate(data)
                }}
                onRequestClose={onRequestClose}
            />
            <PostComment
                comments={comments}
                reloadPost={() => getComments(1)}
            />
            <LoadMore
                totalLeft={totalLeft}
                onRequestLoad={() => getComments(page + 1)}
                />
            <div className={styles.closeComment}>
                <span onClick={onRequestClose}>
                    Close &times;
                </span>
            </div>
            {renderStatus()}
        </div>
    )
}

export default PostComments
