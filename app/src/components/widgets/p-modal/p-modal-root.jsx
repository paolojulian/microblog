import React from 'react';
import { ModalConsumer } from './p-modal-context';

const ModalRoot = () => (
  <ModalConsumer>
    {({ component: Component, props, hideModal }) => 
      Component ? <Component {...props} onRequestClose={hideModal} /> : null
    }
  </ModalConsumer>
);

export default ModalRoot;
