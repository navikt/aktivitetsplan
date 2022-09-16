import 'moment-timezone';
import 'moment/locale/nb';
import 'nav-frontend-core/dist/main.css';
import 'nav-frontend-alertstriper-style/dist/main.css';
import 'nav-frontend-chevron-style/dist/main.css';
import 'nav-frontend-ekspanderbartpanel-style/dist/main.css';
import 'nav-frontend-hjelpetekst-style/dist/main.css';
import 'nav-frontend-knapper-style/dist/main.css';
import 'nav-frontend-lenkepanel-style/dist/main.css';
import 'nav-frontend-lenker-style/dist/main.css';
import 'nav-frontend-lesmerpanel-style/dist/main.css';
import 'nav-frontend-lukknapp-style/dist/main.css';
import 'nav-frontend-modal-style/dist/main.css';
import 'nav-frontend-paneler-style/dist/main.css';
import 'nav-frontend-popover-style/dist/main.css';
import 'nav-frontend-skjema-style/dist/main.css';
import 'nav-frontend-snakkeboble-style/dist/main.css';
import 'nav-frontend-spinner-style/dist/main.css';
import 'nav-frontend-typografi-style/dist/main.css';
import 'nav-frontend-veileder-style/dist/main.css';
import 'nav-frontend-veilederpanel-style/dist/main.css';
import 'nav-datovelger/lib/styles/main.css';

import './variables.css';
import './index.css';
import './styles/print.css';
import './polyfill';

import NAVSPA from '@navikt/navspa';
import moment from 'moment';
import React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import App from './app';
import { eksternBrukerConfig, veilederConfig } from './mocks/appconfig';
import DemoBanner from './mocks/demo/demoBanner';
import { erEksternBruker } from './mocks/demo/sessionstorage';

/* eslint-disable global-require */
if (!global.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'mai', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
});

if (process.env.REACT_APP_MOCK === 'true') {
    const fnr = '/12345678910';
    const path = window.location.pathname;

    if (erEksternBruker()) {
        if (path.includes(fnr)) {
            window.history.replaceState({}, '', '/');
        }
        window.appconfig = eksternBrukerConfig;
    } else if (!erEksternBruker()) {
        if (!path.includes(fnr)) {
            window.history.replaceState({}, '', fnr);
        }
        window.appconfig = veilederConfig;
    }

    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console
    require('./mocks'); // eslint-disable-line global-require

    ReactDOM.render(<DemoBanner />, document.getElementById('demo'));
}

function AppWrapper(props) {
    // Må settes etter at dokumentet er parset
    const id = document.getElementById('pagewrapper') ? '#pagewrapper' : '#modal-a11y-wrapper';
    ReactModal.setAppElement(id);

    return <App {...props} />;
}

NAVSPA.eksporter('aktivitetsplan', AppWrapper);
