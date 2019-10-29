import React from 'react'
import PropTypes from 'prop-types'

/** Components */
import PImage from '../p-image'

const ProfileImage = (props) => {

    const getSize = () => {
        const validSizes = [24, 32, 64, 128, 512, 1024];
        if (validSizes.indexOf(props.size) === -1) {
            return 64
        }
        return props.size
    }

    return <PImage
        style={{ width: getSize()+'px', height: getSize()+'px', borderRadius: '50%' }}
        src={props.src}
        fallback={`/app/webroot/img/profiles/default_avatarx${getSize()}.png`}
        {...props}
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