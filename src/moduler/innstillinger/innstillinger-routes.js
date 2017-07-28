import React from 'react';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
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
import Feilkvittering from './feilkvittering';

function InnstillingerRoutes({ match }) {
    return (
        <Switch>
            <Route exact path={`${match.path}/`} component={Prosesser} />
            <Route
                exact
                path={`${match.path}/manuell`}
                component={SettManuellOppfolging}
            />
            <Route
                path={`${match.path}/manuell/kvittering`}
                component={SettManuellOppfolgingKvittering}
            />
            <Route
                exact
                path={`${match.path}/digital`}
                component={SettDigitalOppfolging}
            />
            <Route
                path={`${match.path}/digital/kvittering`}
                component={SettDigitalKvittering}
            />
            <Route
                exact
                path={`${match.path}/avslutt`}
                component={AvsluttOppfolging}
            />
            <Route
                path={`${match.path}/avslutt/bekreft`}
                component={BekreftAvsluttOppfolging}
            />
            <Route
                path={`${match.path}/avslutt/kvittering`}
                component={AvsluttOppfolgingKvittering}
            />
            <Route
                path={`${match.path}/start/bekreft`}
                component={BekreftStartOppfolging}
            />
            <Route
                path={`${match.path}/start/kvittering`}
                component={StartOppfolgingKvittering}
            />
            <Route
                path={`${match.path}/feilkvittering`}
                component={Feilkvittering}
            />
        </Switch>
    );
}

InnstillingerRoutes.propTypes = {
    match: PT.object.isRequired,
};

export default withRouter(InnstillingerRoutes);
