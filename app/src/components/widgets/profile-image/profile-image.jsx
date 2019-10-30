import React from 'react'
import PropTypes from 'prop-types'

/** Components */
import PImage from '../p-image'

const profilesURL = '/app/webroot/img/profiles/';

const ProfileImage = (props) => {

    return <PImage
        {...props}
        style={{ width: props.size+'px', height: props.size+'px', borderRadius: '50%' }}
        fallback={`${profilesURL}default_avatarx${props.size}.png`}
        src={`${props.src}x${props.size}.png`}
    />
}

ProfileImage.propTypes = {
    src: PropTypes.string,
    size: PropTypes.number
}

ProfileImage.defaultProps = {
    size: 128
}

export default ProfileImage