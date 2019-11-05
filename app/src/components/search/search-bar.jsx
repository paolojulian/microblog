import React from 'react';
import PropTypes from 'prop-types'

import PCard from '../widgets/p-card';

const style = {
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 1rem',
    }
}

const handleKeyPress = e => {
    const re = /^[a-z0-9_ ]*$/i
    if ( ! re.test(e.key)) {
        e.preventDefault();
    }
}

const SearchBar = ({
    handleSearch,
    searchText
}) => (
    <PCard size="fit">
        <div style={style.container}>
            <input type="text"
                placeholder="Search"
                name="search_bar"
                autoComplete="off"
                onPaste={e => e.preventDefault()}
                value={searchText}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                />
        </div>
    </PCard>
)

SearchBar.propTypes = {
    handleSearch: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired
}

export default SearchBar
