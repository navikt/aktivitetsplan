import React from 'react';
import PT from 'prop-types';
import { Router } from 'react-router-dom';
import SideBanner from './moduler/sidebanner/sidebanner';
import Provider from './provider';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import createHistory from './history';
import ScrollToTop from './felles-komponenter/utils/scroll-to-top';
import Hovedside from './hovedside/hovedside';
import './index.less';
import { HiddenIf } from './utils';

function isValueOrGetDefault(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

function App({ fnr }) {
    // NOTE: This is bad, don't use it if you dont HAVE to.
    window.appconfig = window.appconfig || {};
    const path = window.appconfig.CONTEXT_PATH === '' ? '' : '/veilarbpersonflatefs';
    window.appconfig = {
        CONTEXT_PATH: path,
        TILLAT_SET_AVTALT: isValueOrGetDefault(window.appconfig.TILLAT_SET_AVTALT, true),
        VIS_SIDEBANNER: isValueOrGetDefault(window.appconfig.VIS_SIDEBANNER, false),
        FNR_I_URL: isValueOrGetDefault(window.appconfig.FNR_I_URL, true),
        VIS_MALER: isValueOrGetDefault(window.appconfig.VIS_MALER, true),
        TIMEOUTBOX: isValueOrGetDefault(window.appconfig.TIMEOUTBOX, false)
    };

    const history = createHistory();

    window.openDialog = () => history.push('/dialog');

    return (
        <div className="aktivitetsplanfs">
            <Provider key={fnr}>
                <SideBanner visible={window.appconfig.VIS_SIDEBANNER} />
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
            </Provider>
        </div>
    );
}

App.propTypes = {
    fnr: PT.string
};

App.defaultProps = {
    fnr: undefined
};

export default App;
