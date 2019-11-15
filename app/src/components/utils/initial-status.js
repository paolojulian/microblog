const initialStatus = {
    loading: false,
    post: false,
    error: false,
}
export default {
    ...initialStatus,
    LOADING: {
        ...initialStatus,
        loading: true
    },
    POST: {
        ...initialStatus,
        post: true
    },
    ERROR: {
        ...initialStatus,
        error: true
    },
}