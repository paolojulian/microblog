import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
/** Components */
import PLoader from '../widgets/p-loader'

const Post = ({ fetchHandler, ...props }) => {
    const [page, setPage] = useState(1);
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

    const handleScrollDown = async (pageNo = 1) => {
        try {
            const res = await fetchHandler(pageNo);
            if (res.length > 0) {
                setPage(pageNo);
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

    return (
        <div {...props}>
            {props.children}
            {isLoading && <PLoader/>}
        </div>
    )
}

Post.propTypes = {
    fetchHandler: PropTypes.func.isRequired,
}

export default Post
