import 'babel-polyfill';
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Hovedside from './sider/hovedside/hovedside';
import NyAktivitet from './modal/ny-aktivitet';
import EgenAktivitet from './modal/skjema/egen-aktivitet';
import StillingAktivitet from './modal/skjema/stilling-aktivitet';
import Aktivitetvisning from './modal/visning/aktivitetvisning';
import EndreAktivitet from './modal/redigering/endre-aktivitet';
import DialogModal from './dialog/dialog-modal';

export default (
    <Route>
        <IndexRoute component={Hovedside} />
        <Route path="dialog" component={DialogModal} />
        <Route path="dialog/:id" component={DialogModal} />
        <Route path="aktivitet" component={Hovedside}>
            <Route modalId="modal1" path="ny" component={NyAktivitet} />
            <Route modalId="modal2" path="ny/egen" component={EgenAktivitet} />
            <Route modalId="modal4" path="ny/stilling" component={StillingAktivitet} />
            <Route modalId="modal5" path="aktivitet/:id" component={Aktivitetvisning} />
            <Route modalId="modal6" path="aktivitet/:id/endre" component={EndreAktivitet} />
        </Route>
        <Route path="*" component={Hovedside} />
    </Route>
);
