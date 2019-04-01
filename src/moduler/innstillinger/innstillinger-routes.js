import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Prosesser from './prosesser/prosesser';
import AvsluttOppfolging from './avslutt-oppfolging/avslutt-oppfolginsperiode';
import BekreftAvsluttOppfolging from './avslutt-oppfolging/bekreft-avslutt-oppfolginsperiode';
import BekreftStartOppfolging from './start-oppfolging/bekreft-start-oppfolginsperiode';
import StartOppfolgingKvittering from './start-oppfolging/start-oppfolging-kvittering';
import AvsluttOppfolgingKvittering from './avslutt-oppfolging/avslutt-oppfolging-kvittering';
import SettManuellOppfolging from './sett-manuell-oppfolging/sett-manuell-oppfolging';
import SettDigitalOppfolging from './sett-digital-oppfolging/sett-digital-oppfolging';
import SettManuellOppfolgingKvittering from './sett-manuell-oppfolging/sett-manuell-oppfolging-kvittering';
import SettDigitalKvittering from './sett-digital-oppfolging/sett-digital-oppfolging-kvittering';
import StartEskalering from './start-eskalering/start-eskalering';
import StoppEskalering from './stopp-eskalering/stopp-eskalering';
import StartEskaleringKvittering from './start-eskalering/start-eskalering-kvittering';
import StoppEskaleringKvittering from './stopp-eskalering/stopp-eskalering-kvittering';
import OpprettOppgave from './opprett-oppgave/opprett-oppgave';
import Feilkvittering from './feilkvittering';
import OppgaveOpprettetKvittering from './opprett-oppgave/oppgave-opprettet-kvittering';
import StartKvpPeriode from './start-kvp-periode/start-kvp-periode';
import StoppKvpPeriode from './stopp-kvp-periode/stopp-kvp-periode';
import StartKvpKvittering from './start-kvp-periode/start-kvp-periode-kvittering';
import StoppKvpKvittering from './stopp-kvp-periode/stopp-kvp-periode-kvittering';

// TODO FJERN ALLT SOM HAR MED INNSTILLINGER ATT GJÖRE NÅR FLYTT_ALERTSTRIPER_INSIDEN ER PÅ
function InnstillingerRoutes({ match }) {
    const path = match.path;
    return (
        <Switch>
            <Route exact path={`${path}/`} component={Prosesser} />
            <Route
                exact
                path={`${path}/manuell`}
                component={SettManuellOppfolging}
            />
            <Route
                path={`${path}/manuell/kvittering`}
                component={SettManuellOppfolgingKvittering}
            />
            <Route
                exact
                path={`${path}/digital`}
                component={SettDigitalOppfolging}
            />
            <Route
                path={`${path}/digital/kvittering`}
                component={SettDigitalKvittering}
            />
            <Route
                exact
                path={`${path}/avslutt`}
                component={AvsluttOppfolging}
            />
            <Route
                path={`${path}/avslutt/bekreft`}
                component={BekreftAvsluttOppfolging}
            />
            <Route
                path={`${path}/avslutt/kvittering`}
                component={AvsluttOppfolgingKvittering}
            />
            <Route
                path={`${path}/start/bekreft`}
                component={BekreftStartOppfolging}
            />
            <Route
                path={`${path}/start/kvittering`}
                component={StartOppfolgingKvittering}
            />
            <Route
                exact
                path={`${path}/startEskalering`}
                component={StartEskalering}
            />
            <Route
                exact
                path={`${path}/stoppEskalering`}
                component={StoppEskalering}
            />
            <Route
                path={`${path}/startEskalering/kvittering`}
                component={StartEskaleringKvittering}
            />
            <Route
                path={`${path}/stoppEskalering/kvittering`}
                component={StoppEskaleringKvittering}
            />
            <Route
                path={`${path}/oppgave/opprett`}
                component={OpprettOppgave}
            />
            <Route
                path={`${path}/oppgave/kvittering`}
                component={OppgaveOpprettetKvittering}
            />
            <Route
                exact
                path={`${path}/startKvpPeriode`}
                component={StartKvpPeriode}
            />
            <Route
                path={`${path}/startKvp/kvittering`}
                component={StartKvpKvittering}
            />
            <Route
                exact
                path={`${path}/stoppKvpPeriode`}
                component={StoppKvpPeriode}
            />
            <Route
                path={`${path}/stoppKvp/kvittering`}
                component={StoppKvpKvittering}
            />
            <Route path={`${path}/feilkvittering`} component={Feilkvittering} />
        </Switch>
    );
}

InnstillingerRoutes.propTypes = {
    match: PT.object.isRequired,
};

export default InnstillingerRoutes;
