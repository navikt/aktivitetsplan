import 'babel-polyfill';
import React from 'react';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import VilkarModalMedHistorikk from './moduler/vilkar/vilkar-med-historikk';
import VilkarModalUtenHistorikk from './moduler/vilkar/vilkar-uten-historikk';
import NyAktivitet from './moduler/aktivitet/ny-aktivitet/ny-aktivitet';
import AktivitetvisningContainer from './moduler/aktivitet/visning/aktivitetvisning-container';
import EndreAktivitet from './moduler/aktivitet/rediger/endre-aktivitet';
import DialogModal from './dialog/dialog-modal';
import FullforAktivitet from './moduler/aktivitet/avslutt/fullfor-aktivitet';
import AvbrytAktivitet from './moduler/aktivitet/avslutt/avbryt-aktivitet';
import AktivitetmalEndre from './sider/hovedside/mal/aktivitetsmal-endre';
import Aktivitetsmal from './sider/hovedside/mal/aktivitetsmal';
import Prosesser from './moduler/innstillinger/prosesser/prosesser';
import AvsluttOppfolging from './moduler/innstillinger/avslutt-oppfolging/avslutt-oppfolginsperiode';
import BekreftAvsluttOppfolging from './moduler/innstillinger/avslutt-oppfolging/bekreft-avslutt-oppfolginsperiode';
import BekreftStartOppfolging from './moduler/innstillinger/start-oppfolging/bekreft-start-oppfolginsperiode';
import StartOppfolgingKvittering from './moduler/innstillinger/start-oppfolging/start-oppfolging-kvittering';
import AvsluttOppfolgingKvittering from './moduler/innstillinger/avslutt-oppfolging/avslutt-oppfolging-kvittering';
import SettManuellOppfolging from './moduler/innstillinger/sett-manuell-oppfolging/sett-manuell-oppfolging';
import SettDigitalOppfolging from './moduler/innstillinger/sett-digital-oppfolging/sett-digital-oppfolging';
import SettManuellOppfolgingKvittering from './moduler/innstillinger/sett-manuell-oppfolging/sett-manuell-oppfolging-kvittering';
import SettDigitalKvittering from './moduler/innstillinger/sett-digital-oppfolging/sett-digital-oppfolging-kvittering';
import Feilkvittering from './moduler/innstillinger/feilkvittering';
import AktivitetFormContainer from './moduler/aktivitet/aktivitet-forms/aktivitet-form-container';
import BekreftSlettVisningContainer from './moduler/aktivitet/visning/bekreft-slett-visning/bekreft-slett-visning-container';
import ArbeidslisteContainer from './moduler/arbeidsliste/arbeidsliste-container';
import { VIS_INNSTILLINGER, FNR_I_URL } from '~config'; // eslint-disable-line

export const aktivitetRoute = aktivitetId => `/aktivitet/vis/${aktivitetId}`;
export const endreAktivitetRoute = aktivitetId =>
    `/aktivitet/endre/${aktivitetId}`;
export const fullforAktivitetRoute = aktivitetId =>
    `/aktivitet/fullfor/${aktivitetId}`;
export const avbrytAktivitetRoute = aktivitetId =>
    `/aktivitet/avbryt/${aktivitetId}`;

const Routing = ({ location }) => {
    if (FNR_I_URL) {
        // eslint-disable-next-line
        location.pathname = `/${location.pathname
            .split('/')
            .splice(2)
            .join('/')}`;
    }

    return (
        <Switch location={location}>
            <Route path="/vilkar" component={VilkarModalMedHistorikk} />
            <Route path="/vilkar/:key" component={VilkarModalUtenHistorikk} />
            <Route path="/mal" component={Aktivitetsmal} />
            <Route path="/mal/endre" component={AktivitetmalEndre} />
            <Route path="/innstillinger" component={Prosesser} />
            <Route
                path="/innstillinger/manuell"
                component={SettManuellOppfolging}
            />
            <Route
                path="/innstillinger/manuell/kvittering"
                component={SettManuellOppfolgingKvittering}
            />
            <Route path="/innstillinger" component={Prosesser} />
            <Route
                path="/innstillinger/digital"
                component={SettDigitalOppfolging}
            />
            <Route
                path="/innstillinger/digital/kvittering"
                component={SettDigitalKvittering}
            />
            <Route
                path="/innstillinger/avslutt"
                component={AvsluttOppfolging}
            />
            <Route
                path="/innstillinger/avslutt/bekreft"
                component={BekreftAvsluttOppfolging}
            />
            <Route
                path="/innstillinger/avslutt/kvittering"
                component={AvsluttOppfolgingKvittering}
            />
            <Route
                path="/innstillinger/start/bekreft"
                component={BekreftStartOppfolging}
            />
            <Route
                path="/innstillinger/start/kvittering"
                component={StartOppfolgingKvittering}
            />
            <Route
                path="/innstillinger/feilkvittering"
                component={Feilkvittering}
            />
            <Route exact path="/dialog" component={DialogModal} />
            <Route exact path="/dialog/:id" component={DialogModal} />

            <Route exact path="/aktivitet/ny" component={NyAktivitet} />
            <Route
                exact
                path="/aktivitet/ny/*"
                component={AktivitetFormContainer}
            />

            <Route
                exact
                path="/aktivitet/vis/:id"
                component={AktivitetvisningContainer}
            />
            <Route
                exact
                path="/aktivitet/slett/:id"
                component={BekreftSlettVisningContainer}
            />
            <Route
                exact
                path="/aktivitet/endre/:id"
                component={EndreAktivitet}
            />
            <Route
                exact
                path="/aktivitet/avbryt/:id"
                component={AvbrytAktivitet}
            />
            <Route
                exact
                path="/aktivitet/fullfor/:id"
                component={FullforAktivitet}
            />
            <Route
                path="/arbeidsliste"
                component={ArbeidslisteContainer}
            />
        </Switch>
    );
};

Routing.propTypes = {
    location: PT.object.isRequired,
};

export default withRouter(Routing);
