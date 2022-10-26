import './index.less';

import PT from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Router } from 'react-router-dom';

import { useEventListener } from './felles-komponenter/hooks/useEventListner';
import { useReduxDispatch } from './felles-komponenter/hooks/useReduxDispatch';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import ScrollToSistViste from './felles-komponenter/utils/ScrollToSistViste';
import createHistory from './history';
import Hovedside from './hovedside/Hovedside';
import Provider from './provider';
import { HiddenIf, getContextPath } from './utils';
import { UpdateEventHandler } from './utils/UpdateHandler';
import useIsVisible from './utils/useIsVisible';

function isValueOrGetDefault(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

function App({ fnr, key }) {
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

    const history = createHistory();

    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail;
        if (aktivitetId) {
            history.replace('aktivitet/vis/' + aktivitetId);
        }
    });

    const aktivitetsplanref = useRef();
    const elementIsVisible = useIsVisible(aktivitetsplanref.current);

    const dispatch = useReduxDispatch();

    useEffect(() => {}, [elementIsVisible]);

    return (
        <div className="aktivitetsplanfs" ref={aktivitetsplanref}>
            <Provider key={fnr + key}>
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <Router history={history}>
                            <ScrollToSistViste>
                                <Hovedside />
                            </ScrollToSistViste>
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
