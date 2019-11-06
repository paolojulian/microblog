import { search } from '../../utils/search';

export const apiSearch = (searchText) => async dispatch => {
    try {
        const res = await search(`/search/index/${searchText}.json`);
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
}

export const apiSearchUsers = (searchText, page = 1) => async dispatch => {
    try {
        const res = await search(`/search/users/${searchText}.json?page=${page}`);
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
}

export const apiSearchPosts = (searchText, page = 1) => async dispatch => {
    try {
        const res = await search(`/search/posts/${searchText}.json?page=${page}`);
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
}
