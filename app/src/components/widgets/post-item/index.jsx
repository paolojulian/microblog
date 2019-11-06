import React from 'react'
import { Link } from 'react-router-dom';

import PCard from '../p-card';
import ProfileImage from '../profile-image';
import PostImage from '../post-image';

const postStyle = {
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left'
    },
    img: {
        margin: '0 0.5rem',
        marginLeft: '1rem'
    },
    info: {
        flex: '1'
    },
    title: {
        fontSize: '1.1rem',
        color: 'var(--primary-dark)'
    },
    body: {
        padding: '0.5rem 1rem',
        textAlign: 'left'
    }
}

export const PostItemMinimal = ({ post: { User, Post }}) => (
    <PCard size="fit">
        <div style={postStyle.header}>
            <div style={postStyle.img}>
                <ProfileImage
                    src={User.avatar_url}
                    size={24}
                />
            </div>
            <div style={postStyle.info}>
                <div style={postStyle.title}>
                    <Link to={`/posts/${Post.id}`}>
                        TITLE: {Post.title}
                    </Link>
                </div>
                <div>
                    <Link to={`/profiles/${User.username}`}>
                        <span className="username">
                            @{User.username}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    </PCard>
)

export const PostItem = ({ post: { User, Post } }) => (
    <PCard size="fit">
        <div style={postStyle.header}>
            <div style={postStyle.img}>
                <ProfileImage
                    src={User.avatar_url}
                    size={24}
                />
            </div>
            <div style={postStyle.info}>
                <div style={postStyle.title}>
                    <Link to={`/posts/${Post.id}`}>
                        {Post.title}
                    </Link>
                </div>
                <div>
                    <Link to={`/profiles/${User.username}`}>
                        <span className="username">
                            @{User.username}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
        <div style={postStyle.body}>
            {Post.body}
        </div>
        {!!Post.img_path && <PostImage imgPath={Post.img_path} title={Post.title}/>}
    </PCard>
)

export default PostItem
