import 'babel-polyfill';
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Hovedside from './sider/hovedside/hovedside';
import AktivitetsmalModal from './sider/hovedside/mal/aktivitetsmal-modal';
import VilkarModalMedHistorikk from './modal/vilkar/vilkar-med-historikk';
import VilkarModalUtenHistorikk from './modal/vilkar/vilkar-uten-historikk';
import NyAktivitet from './modal/ny-aktivitet';
import EgenAktivitet from './modal/skjema/egen-aktivitet';
import StillingAktivitet from './modal/skjema/stilling-aktivitet';
import Aktivitetvisning from './modal/visning/aktivitetvisning';
import EndreAktivitet from './modal/redigering/endre-aktivitet';
import DialogModal from './dialog/dialog-modal';
import BegrunnelseFullfortAktivitet from './modal/begrunnelse/begrunnelse-fullfort-aktivitet';
import BegrunnelseAvbruttAktivitet from './modal/begrunnelse/begrunnelse-avbrutt-aktivitet';

export const aktivitetRoute = (aktivitetId) => `/aktivitet/vis/${aktivitetId}`;
export const endreAktivitetRoute = (aktivitetId) => `/aktivitet/endre/${aktivitetId}`;
export const fullforAktivitetRoute = (aktivitetId) => `/aktivitet/fullfor/${aktivitetId}`;
export const avbrytAktivitetRoute = (aktivitetId) => `/aktivitet/avbryt/${aktivitetId}`;

export default (
    <Route>
        <IndexRoute component={Hovedside} />
        <Route modalId="aktivitetsmalModal" path="mal" component={AktivitetsmalModal} />
        <Route path="dialog" component={DialogModal} />
        <Route path="dialog/:id" component={DialogModal} />
        <Route path="vilkarhistorikk" component={VilkarModalMedHistorikk} />
        <Route path="vilkarhistorikk/:key" component={VilkarModalUtenHistorikk} />
        <Route path="aktivitet" component={Hovedside}>
            <Route path="ny" component={NyAktivitet} />
            <Route path="ny/egen" component={EgenAktivitet} />
            <Route path="ny/stilling" component={StillingAktivitet} />
            <Route path="vis/:id" component={Aktivitetvisning} />
            <Route path="endre/:id" component={EndreAktivitet} />
            <Route path="avbryt/:id" component={BegrunnelseAvbruttAktivitet} />
            <Route path="fullfor/:id" component={BegrunnelseFullfortAktivitet} />
        </Route>
        <Route path="*" component={Hovedside} />
    </Route>
);
