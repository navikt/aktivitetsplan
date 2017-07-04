import React, { Component } from 'react';
import { render } from 'react-dom';
import { EKSEMPEL_FNR, CONTEXT_PATH } from './config';
import App from '../src/app';
import { fnrFraUrl } from '../src/bootstrap/fnr-provider';

if (!fnrFraUrl()) {
    window.history.replaceState(
        EKSEMPEL_FNR,
        '',
        `${CONTEXT_PATH}/${EKSEMPEL_FNR}`
    );
}
render(<App />, document.getElementById('app'));
