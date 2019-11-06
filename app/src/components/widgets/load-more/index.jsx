import React from 'react';

import PropTypes from 'prop-types';

const LoadMore = ({ onRequestLoad, totalLeft }) => {
    if ( ! totalLeft || totalLeft === 0) {
        return '';
    }

    return (
        <div style={{
            padding: '1rem 0',
            color: 'var(--secondary)',
            fontStyle: 'italic',
            textAlign: 'center',
            userSelect: 'none',
            cursor: 'pointer',
        }}
        onClick={onRequestLoad}>
            View more result{!!totalLeft && totalLeft.length > 1 ? '/s ': ' '}
            {!!totalLeft ? `(${totalLeft})` : ''}
        </div>
    )
}

LoadMore.propTypes = {
    onRequestLoad: PropTypes.func.isRequired,
    totalResult: PropTypes.number
}

LoadMore.defaultProps = {
    totalResult: null
}

export default LoadMore
