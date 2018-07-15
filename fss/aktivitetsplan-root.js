import React from 'react';
import ReactModal from 'react-modal';
import * as ReactDOM from 'react-dom';
import '../src/index.less';
import App from '../src/app';

const scope = window['NAVSPA'] = window['NAVSPA'] || {};
scope['aktivitetsplan'] = function (element, props) {
    ReactModal.setAppElement('#modal-a11y-wrapper');
    ReactDOM.render(<App {...props} />, element);
};

export default function AktivitetsplanRoot() {
    // Må settes etter at dokumentet er parset
    ReactModal.setAppElement('#modal-a11y-wrapper');
    return <App />;
}
