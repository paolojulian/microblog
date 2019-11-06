import React from 'react';
import PropTypes from 'prop-types';

import PCard from '../widgets/p-card/p-card';
import PostItem from '../widgets/post-item';
import LoadMore from '../widgets/load-more';

const SearchPosts = ({
    posts,
    onRequestLoad,
    totalLeft,
    ...props
}) => {

    return (
        <div {...props}>
            <PCard
                size="fit"
                style={{marginBottom: '0.5rem'}}>
                Posts
            </PCard>
            {posts.map((post, i) => (
                <PostItem
                    key={post.Post.id + i}
                    post={post}
                />
            ))}
            <LoadMore
                totalLeft={totalLeft}
                onRequestLoad={onRequestLoad}
                />
        </div>
    )
}

SearchPosts.propTypes = {
    onRequestLoad: PropTypes.func.isRequired,
    totalLeft: PropTypes.number.isRequired,
    posts: PropTypes.array.isRequired
}

export default SearchPosts
