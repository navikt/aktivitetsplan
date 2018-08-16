import React from 'react';
import ReactModal from 'react-modal';
import '../src/index.less';
import App from '../src/app';
import NAVSPA from './NAVSPA';

function AppWrapper(props) {
    // Må settes etter at dokumentet er parset
    ReactModal.setAppElement('#modal-a11y-wrapper');
    return <App {...props} />;
}

NAVSPA.eksporter('aktivitetsplan', AppWrapper);
