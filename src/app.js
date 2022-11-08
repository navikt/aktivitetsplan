import './index.less';

import PT from 'prop-types';
import React from 'react';
import { Router } from 'react-router-dom';

import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import createHistory from './history';
import Hovedside from './hovedside/Hovedside';
import Provider from './provider';
import { HiddenIf, getContextPath } from './utils';
import { UpdateEventHandler } from './utils/UpdateHandler';

function isValueOrGetDefault(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

export const AKTIVITETSPLAN_ROOT_NODE_ID = 'aktivitetsplan-app';

const history = createHistory(getContextPath())
// NOTE: This is bad, don't use it if you dont HAVE to.
window.appconfig = window.appconfig || {};
const path = window.appconfig.CONTEXT_PATH === '' ? '' : getContextPath();
window.appconfig = {
    CONTEXT_PATH: path,
    TILLAT_SET_AVTALT: isValueOrGetDefault(window.appconfig.TILLAT_SET_AVTALT, true),
    FNR_I_URL: isValueOrGetDefault(window.appconfig.FNR_I_URL, true),
    VIS_MALER: isValueOrGetDefault(window.appconfig.VIS_MALER, true),
    TIMEOUTBOX: isValueOrGetDefault(window.appconfig.TIMEOUTBOX, false),
};

function App({ fnr, key }) {
    return (
        <div className="aktivitetsplanfs" id={AKTIVITETSPLAN_ROOT_NODE_ID}>
            <Provider key={fnr + key}>
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <Router history={history}>
                            <Hovedside />
                        </Router>
                        <HiddenIf hidden={!window.appconfig.TIMEOUTBOX}>
                            <Timeoutbox />
                        </HiddenIf>
                    </div>
                </div>
                <UpdateEventHandler />
            </Provider>
        </div>
    );
}

App.propTypes = {
    fnr: PT.string,
};

App.defaultProps = {
    fnr: undefined,
};

export default App;
