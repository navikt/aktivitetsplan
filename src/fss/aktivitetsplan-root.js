import React from 'react';
import ReactModal from 'react-modal';
import '../index.less';
import App from '../app';

export default function AktivitetsplanRoot() {
    // Må settes etter at dokumentet er parset
    ReactModal.setAppElement('#modal-a11y-wrapper');
    return <App />;
}
