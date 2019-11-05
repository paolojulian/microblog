import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

/** Components */
import PLoader from '../widgets/p-loader'

const ModalScrollPaginate = ({
    fetchHandler,
    bodyRef,
    page,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLast, setIsLast] = useState(false);

    useEffect(() => {
        if (page === 1) {
            setIsLast(false);
        }
        if ( ! isLast) {
            bodyRef.current.addEventListener('scroll', listenOnScroll);
        } else {
            bodyRef.current.removeEventListener('scroll', listenOnScroll);
        }
        return () => {
            bodyRef.current.removeEventListener('scroll', listenOnScroll);
        };
    }, [isLoading, page, isLast])

    const listenOnScroll = e => {
        const element = e.target;
        if (isLast) return;
        if (isLoading) return;
        if ((element.scrollTop + element.clientHeight) === element.scrollHeight) {
            setIsLoading(true)
            handleScrollDown(page + 1)
                .then(() => setIsLoading(false));
        }
    }

    const handleScrollDown = async (pageNo = 1) => {
        try {
            const res = await fetchHandler(pageNo);
            console.log(res);
            if (res.length > 0) {
                setIsLast(false);
            } else {
                setIsLast(true);
            }
            return Promise.resolve();
        } catch (e) {
            setIsLast(true);
            return Promise.reject();
        }
    }

    return (
        <div
            {...props}
            ref={bodyRef}
        >
            {props.children}
            {isLoading && <PLoader/>}
        </div>
    )
}

ModalScrollPaginate.propTypes = {
    /** The function to be runned when scrolled is triggered */
    fetchHandler: PropTypes.func.isRequired,
    /** Current page number */
    page: PropTypes.number,
    /** The reference on where the scroll should listen */
    bodyRef: PropTypes.object.isRequired
}

ModalScrollPaginate.defaultProps = {
    page: 1
}

export default ModalScrollPaginate
