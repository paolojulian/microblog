import React, { useState, createContext } from 'react';

const ModalContext = createContext({
  component: null,
  props: {},
  showModal: () => {},
  hideModal: () => {}
});

export const ModalProvider = (props) => {
  const [state, setState] = useState({
    component: null,
    props: {},
    showModal: (component, props = {}) => {showModal(component, props)},
    hideModal: () => {hideModal()},
  })
  const showModal = (component, props = {}) => {
    setState({
      ...state,
      component,
      props
    })
    console.log(state);
  }
  const hideModal = () => {
    setState({
      ...state,
      component: null,
      props: {}
    })
  }
  return (
    <ModalContext.Provider value={state}>
      {props.children}
    </ModalContext.Provider>
  );
}

export const ModalConsumer = ModalContext.Consumer;
