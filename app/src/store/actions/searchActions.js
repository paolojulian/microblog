import { search } from '../../utils/search';

export const apiSearch = (searchText) => async dispatch => {
    try {
        const res = await search(`/search/index/${searchText}.json`);
        return Promise.resolve(res.data.data);
    } catch (e) {
        return Promise.reject(e);
    }
}
