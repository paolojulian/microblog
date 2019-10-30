import React from 'react'
import PropTypes from 'prop-types'

/** Components */
import PImage from '../p-image'

const profilesURL = '/app/webroot/img/profiles/';

const ProfileImage = (props) => {

    const getSize = () => {
        const validSizes = [24, 32, 64, 128, 512, 1024];
        if (validSizes.indexOf(props.size) === -1) {
            return 64
        }
        return props.size
    }

    return <PImage
        {...props}
        style={{ width: getSize()+'px', height: getSize()+'px', borderRadius: '50%' }}
        fallback={`${profilesURL}default_avatarx${getSize()}.png`}
        src={profilesURL + props.src}
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