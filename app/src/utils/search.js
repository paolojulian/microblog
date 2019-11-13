import axios from 'axios';
const resources = {};

const makeRequestCreator = () => {
  let cancel;

  return async (query, config = {}) => {
    if (cancel) {
      // Cancel the previous request before making a new request
      cancel.cancel();
    }

    // Create a new CancelToken
    cancel = axios.CancelToken.source();
    try {
      if (resources[query]) {
        // Return result if it exists
        return resources[query];
      }
      const res = await axios(query, { ...config, cancelToken: cancel.token });

      const result = res.data.data;
      // Store response
      resources[query] = result;

      return result;
    } catch (error) {
      if (axios.isCancel(error)) {
        return resources[query];
      } else {
        return {
          users: {list: []},
          posts: {list: []},
        };
      }
    }
  };
};

export const search = makeRequestCreator();