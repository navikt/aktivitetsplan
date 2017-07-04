import 'babel-polyfill';
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Hovedside from './sider/hovedside/hovedside';
import VilkarModal from './moduler/vilkar/vilkar-modal';
import VilkarModalMedHistorikk from './modal/vilkar/vilkar-med-historikk';
import VilkarModalUtenHistorikk from './modal/vilkar/vilkar-uten-historikk';
import NyAktivitet from './modal/ny-aktivitet';
import EgenAktivitet from './modal/skjema/egen-aktivitet';
import StillingAktivitet from './modal/skjema/stilling-aktivitet';
import SokeavtaleAktivitet from './modal/skjema/sokeavtale-aktivitet';
import BehandlingAktivitet from './modal/skjema/behandling-aktivitet';
import Aktivitetvisning from './modal/visning/aktivitetvisning';
import EndreAktivitet from './modal/redigering/endre-aktivitet';
import DialogModal from './dialog/dialog-modal';
import FullforAktivitet from './modal/ferdigstilt/fullfor-aktivitet';
import AvbrytAktivitet from './modal/ferdigstilt/avbryt-aktivitet';
import AktivitetmalEndre from './sider/hovedside/mal/aktivitetsmal-endre';
import Aktivitetsmal from './sider/hovedside/mal/aktivitetsmal';
import InnstillingerModal from './modal/innstillinger/innstillinger-modal';
import Prosesser from './modal/innstillinger/prosesser';
import AvsluttOppfolging from './modal/innstillinger/avslutt-oppfolginsperiode';
import BekreftAvsluttOppfolging
    from './modal/innstillinger/bekreft-avslutt-oppfolginsperiode';
import BekreftStartOppfolging
    from './modal/innstillinger/bekreft-start-oppfolginsperiode';
import StartOppfolgingKvittering
    from './modal/innstillinger/start-oppfolging-kvittering';
import AvsluttOppfolgingKvittering
    from './modal/innstillinger/avslutt-oppfolging-kvittering';
import { VIS_INNSTILLINGER, FNR_I_URL } from '~config'; // eslint-disable-line

export const aktivitetRoute = aktivitetId => `/aktivitet/vis/${aktivitetId}`;
export const endreAktivitetRoute = aktivitetId =>
    `/aktivitet/endre/${aktivitetId}`;
export const fullforAktivitetRoute = aktivitetId =>
    `/aktivitet/fullfor/${aktivitetId}`;
export const avbrytAktivitetRoute = aktivitetId =>
    `/aktivitet/avbryt/${aktivitetId}`;

const routing = (
    <Route component={Hovedside}>
        <IndexRoute />
        <Route path="vilkar" component={VilkarModal} />
        <Route path="mal" component={Aktivitetsmal} />
        <Route path="mal/endre" component={AktivitetmalEndre} />
        {VIS_INNSTILLINGER &&
            <Route path="innstillinger" component={InnstillingerModal}>
                <IndexRoute component={Prosesser} />
                <Route path="avslutt" component={AvsluttOppfolging} />
                <Route
                    path="avslutt/bekreft"
                    component={BekreftAvsluttOppfolging}
                />
                <Route
                    path="start/bekreft"
                    component={BekreftStartOppfolging}
                />
            </Route>}
        {VIS_INNSTILLINGER &&
            <Route>
                <Route
                    path="innstillinger/avslutt/kvittering"
                    component={() => <AvsluttOppfolgingKvittering />}
                />
                <Route
                    path="innstillinger/start/kvittering"
                    component={() => <StartOppfolgingKvittering />}
                />
            </Route>}
        <Route path="dialog" component={DialogModal} />
        <Route path="dialog/:id" component={DialogModal} />
        <Route path="vilkarhistorikk" component={VilkarModalMedHistorikk} />
        <Route
            path="vilkarhistorikk/:key"
            component={VilkarModalUtenHistorikk}
        />
        <Route path="aktivitet">
            <Route path="ny" component={NyAktivitet} />
            <Route path="ny/egen" component={EgenAktivitet} />
            <Route path="ny/stilling" component={StillingAktivitet} />
            <Route path="ny/sokeavtale" component={SokeavtaleAktivitet} />
            <Route path="ny/behandling" component={BehandlingAktivitet} />
            <Route path="vis/:id" component={Aktivitetvisning} />
            <Route path="endre/:id" component={EndreAktivitet} />
            <Route path="avbryt/:id" component={AvbrytAktivitet} />
            <Route path="fullfor/:id" component={FullforAktivitet} />
        </Route>
        <Route path="*" />
    </Route>
);

function TomDiv() {
    return <div />;
}

export default (FNR_I_URL
    ? <Route path="/">
          <IndexRoute component={TomDiv} />
          <Route path=":fnr">
              {routing}
          </Route>
      </Route>
    : routing);
