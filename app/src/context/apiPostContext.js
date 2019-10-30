import React, { useState, createContext } from 'react';
import axios from 'axios';

const ApiPostContext = createContext({
    props: {},
    createComment: () => {}
});

export const ApiPostProvider = (props) => {
    const [state, setState] = useState({
        props: {},
        createComment
    })

    const createComment = async () => {
        try {
            await axios.post(`/comments.json`)
            return Promise.resolve()
        } catch (e) {
            return Promise.reject()
        }
    }

    return (
        <ApiPostContext.Provider value={state}>
            {props.children}
        </ApiPostContext.Provider>
    );
}

export const ApiPostConsumer = ApiPostContext.Consumer;
