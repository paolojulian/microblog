import React, {useState} from 'react'
import PropTypes from 'prop-types'

/** Components */
import PImage from '../p-image'

const ProfileImage = (props) => {

    const getSize = () => {
        const validSizes = ['24', '32', '64', '128', '512', '1024'];
        let size = 'x'
        if (validSizes.indexOf(props.size) === -1) {
            return size + '64'
        }
        return size + props.size
    }

    return <PImage
        src={props.src}
        fallback={`/app/webroot/img/profiles/default_avatar${getSize()}.png`}
        {...props}
    />
}

ProfileImage.propTypes = {
    src: PropTypes.string,
    size: PropTypes.string
}

ProfileImage.defaultProps = {
    size: '128'
}

export default ProfileImage