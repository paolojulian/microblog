import axios from 'axios';

// Set to every axios request or remove header
const setTokenToAuthHeader = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setTokenToAuthHeader;