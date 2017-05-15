import 'babel-polyfill';
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Hovedside from './sider/hovedside/hovedside';
import AktivitetsmalModal from './sider/hovedside/mal/aktivitetsmal-modal';
import NyAktivitet from './modal/ny-aktivitet';
import EgenAktivitet from './modal/skjema/egen-aktivitet';
import StillingAktivitet from './modal/skjema/stilling-aktivitet';
import Aktivitetvisning from './modal/visning/aktivitetvisning';
import EndreAktivitet from './modal/redigering/endre-aktivitet';
import DialogModal from './dialog/dialog-modal';
import BegrunnelseFullfortAktivitet from './modal/begrunnelse/begrunnelse-fullfort-aktivitet';
import BegrunnelseAvbruttAktivitet from './modal/begrunnelse/begrunnelse-avbrutt-aktivitet';

export default (
    <Route>
        <IndexRoute component={Hovedside} />
        <Route modalId="aktivitetsmalModal" path="mal" component={AktivitetsmalModal} />
        <Route path="dialog" component={DialogModal} />
        <Route path="dialog/:id" component={DialogModal} />
        <Route path="aktivitet" component={Hovedside}>
            <Route path="ny" component={NyAktivitet} />
            <Route path="ny/egen" component={EgenAktivitet} />
            <Route path="ny/stilling" component={StillingAktivitet} />
            <Route path="aktivitet/:id" component={Aktivitetvisning} />
            <Route path="aktivitet/:id/endre" component={EndreAktivitet} />
            <Route path="aktivitet/:id/avbryt" component={BegrunnelseAvbruttAktivitet} />
            <Route path="aktivitet/:id/fullfor" component={BegrunnelseFullfortAktivitet} />
        </Route>
        <Route path="*" component={Hovedside} />
    </Route>
);
