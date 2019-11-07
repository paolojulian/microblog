import React, { useState, createContext } from 'react';

import AlertNotification from './p-alert-notification';

export const ModalContext = createContext({
  component: null,
  props: {},
  notify: {
    alert: () => {},
    success: () => {},
    danger: () => {},
  },
  showModal: () => {},
  hideModal: () => {}
});

export const ModalProvider = (props) => {
  const [state, setState] = useState({
    component: null,
    props: {},
    notify: {
      alert: (body = '') => {showModal(AlertNotification, { type: 'alert', body })},
      success: (body = '') => {showModal(AlertNotification, { type: 'success', body })},
      danger: (body = '') => {showModal(AlertNotification, { type: 'danger', body })},
    },
    showModal: (component, props = {}) => {showModal(component, props)},
    hideModal: () => {hideModal()},
  })
  const showModal = (component, props = {}) => {
    setState({
      ...state,
      component,
      props
    })
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
