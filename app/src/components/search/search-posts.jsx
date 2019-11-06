import React from 'react';
import PropTypes from 'prop-types';

import PCard from '../widgets/p-card/p-card';
import PostItem from '../widgets/post-item';

const SearchPosts = ({ posts, ...props }) => {
    return (
        <div {...props}>
            <PCard
                size="fit"
                style={{marginBottom: '0.5rem'}}
            >
                Posts
            </PCard>
            {posts.map((post, i) => (
                <PostItem
                    key={post.Post.id + i}
                    post={post}
                />
            ))}
        </div>
    )
}

SearchPosts.propTypes = {
    posts: PropTypes.array.isRequired
}

export default SearchPosts
