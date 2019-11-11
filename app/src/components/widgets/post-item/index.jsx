import React from 'react'
import { Link } from 'react-router-dom';

import PCard from '../p-card';
import ProfileImage from '../profile-image';
import PostImage from '../post-image';
import Username from '../username';

const postStyle = {
    post: {
        width: '100%',
        padding: '1rem 0',
    },
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
    <Link to={`/posts/${Post.id}`}>
        <div style={postStyle.post} className="hover-grey">
            <div 
                style={postStyle.header}>
                <div style={postStyle.img}>
                    <ProfileImage
                        src={User.avatar_url}
                        size={24}
                    />
                </div>
                <div style={postStyle.info}>
                    <div style={postStyle.title}>
                        TITLE: {Post.title}
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
        </div>
    </Link>
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
                    <Username username={User.username}/>
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
