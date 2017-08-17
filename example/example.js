import React, { Component } from 'react';
import { render } from 'react-dom';
import { EKSEMPEL_FNR, CONTEXT_PATH } from './config';
import App from '../src/app';
import { fnrFraUrl } from '../src/bootstrap/fnr-provider';
import * as Modal from "react-modal";

if (!fnrFraUrl() && EKSEMPEL_FNR) {
    window.history.replaceState(
        EKSEMPEL_FNR,
        '',
        `${CONTEXT_PATH}/${EKSEMPEL_FNR}`
    );
}

Modal.setAppElement('#modal-a11y-wrapper');

render(<App />, document.getElementById('modal-a11y-wrapper'));
