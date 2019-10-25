import React, { useState } from 'react'
import PropTypes from 'prop-types'

const PImage = (props) => {

    const [src, setSrc] = useState(props.src)
    const [error, setError] = useState(false)

    const onError = () => {
        if ( ! error) {
            setSrc(props.fallback);
            setError(true);
        }
    }

    return <img
        {...props}
        src={src}
        onError={onError}
    />
}

PImage.propTypes = {
    src: PropTypes.string,
}

export default PImage