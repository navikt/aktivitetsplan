import React from 'react';
import { render } from 'react-dom';
import ReactModal from 'react-modal';
import App from '../src/app';

/* eslint-disable global-require */
if (!global.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

ReactModal.setAppElement('#pagewrapper');

render(<App />, document.getElementById('mainapp'));
