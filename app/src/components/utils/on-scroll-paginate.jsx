import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

/** Components */
import PLoader from '../widgets/p-loader'

const Post = ({ fetchHandler, ...props }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLast, setIsLast] = useState(false);

    useEffect(() => {
        if (props.page === 1) {
            setIsLast(false);
        }
        if ( ! isLast) {
            window.addEventListener('scroll', listenOnScroll);
        } else {
            window.removeEventListener('scroll', listenOnScroll);
        }
        return () => {
            window.removeEventListener('scroll', listenOnScroll);
        };
    }, [isLoading, props.page, isLast])

    const handleScrollDown = async (pageNo = 1) => {
        try {
            const res = await fetchHandler(pageNo);
            if (res.length > 0) {
                setIsLast(false);
            } else {
                setIsLast(true);
            }
            return Promise.resolve();
        } catch (e) {
            setIsLast(true);
        }
    }

    const listenOnScroll = () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            if (isLast) return;
            if ( ! isLoading) {
                setIsLoading(true)
                handleScrollDown(props.page + 1)
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
    page: PropTypes.number
}

Post.defaultProps = {
    page: 1
}

export default Post
