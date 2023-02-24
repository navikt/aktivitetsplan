import 'moment-timezone';
import 'moment/locale/nb';

import { Modal } from '@navikt/ds-react';
import NAVSPA from '@navikt/navspa';
import moment from 'moment';
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';
import { eksternBrukerConfig, veilederConfig } from './mocks/appconfig';
import DemoBanner from './mocks/demo/demoBanner';
import { erEksternBruker } from './mocks/demo/sessionstorage';

if (!window.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'mai', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
});

const usingHashRouting = process.env.REACT_APP_USE_HASH_ROUTER === 'true';

export const mockfnr = '12345678910';
if (process.env.REACT_APP_MOCK === 'true') {
    const fnr = mockfnr;
    const pathnamePrefix = `${process.env.PUBLIC_URL}/${usingHashRouting ? '#/' : ''}`;

    if (erEksternBruker()) {
        window.history.replaceState({}, '', pathnamePrefix);
        window.appconfig = eksternBrukerConfig;
    } else if (!erEksternBruker()) {
        window.history.replaceState({}, '', pathnamePrefix + fnr);
        window.appconfig = veilederConfig;
    }

    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console
    import('./mocks');

    ReactDOM.render(<DemoBanner />, document.getElementById('demo'));
}

function AppWrapper(props) {
    if (process.env.REACT_APP_MOCK === 'true') {
        props = { ...props, fnr: erEksternBruker() ? undefined : mockfnr };
    }

    // Må settes etter at dokumentet er parset
    const id = document.getElementById('pagewrapper') ? '#pagewrapper' : '#modal-a11y-wrapper';
    Modal.setAppElement(id);

    return <App {...props} />;
}

NAVSPA.eksporter('aktivitetsplan', AppWrapper);
