import React from 'react';

const styles = {
    wrapper: {
        position: 'relative',
        margin: '1rem 0'
    },
    img: {
        width: '100%'
    }
}

const PostImage = ({ imgPath, title }) => (
    <div style={styles.wrapper}>
        <img
            style={styles.img}
            src={imgPath + 'x512.png'}
            alt={title}/>
    </div>
)

export default PostImage
