import './index.less';

import PT from 'prop-types';
import React from 'react';
import { Router } from 'react-router-dom';

import { useEventListener } from './felles-komponenter/hooks/useEventListner';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import ScrollToTop from './felles-komponenter/utils/scroll-to-top';
import createHistory from './history';
import Hovedside from './hovedside/hovedside';
import Provider from './provider';
import { HiddenIf } from './utils';
import { UppdateEventHandler } from './utils/UpdateHandler';

function isValueOrGetDefault(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

function App({ fnr, key }) {
    // NOTE: This is bad, don't use it if you dont HAVE to.
    window.appconfig = window.appconfig || {};
    const path = window.appconfig.CONTEXT_PATH === '' ? '' : '/veilarbpersonflatefs';
    window.appconfig = {
        CONTEXT_PATH: path,
        TILLAT_SET_AVTALT: isValueOrGetDefault(window.appconfig.TILLAT_SET_AVTALT, true),
        FNR_I_URL: isValueOrGetDefault(window.appconfig.FNR_I_URL, true),
        VIS_MALER: isValueOrGetDefault(window.appconfig.VIS_MALER, true),
        TIMEOUTBOX: isValueOrGetDefault(window.appconfig.TIMEOUTBOX, false),
    };

    const history = createHistory();

    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail;
        if (aktivitetId) {
            history.replace('aktivitet/vis/' + aktivitetId);
        }
    });

    return (
        <div className="aktivitetsplanfs">
            <Provider key={fnr + key}>
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <Router history={history}>
                            <ScrollToTop>
                                <Hovedside />
                            </ScrollToTop>
                        </Router>
                        <HiddenIf hidden={!window.appconfig.TIMEOUTBOX}>
                            <Timeoutbox />
                        </HiddenIf>
                    </div>
                </div>
                <UppdateEventHandler />
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
