import React from 'react';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import AktivitetFormContainer from './aktivitet-forms/aktivitet-form-container';
import AktivitetvisningContainer from './visning/aktivitetvisning-container';
import BekreftSlettVisningContainer from './visning/bekreft-slett-visning/bekreft-slett-visning-container';
import EndreAktivitet from './rediger/endre-aktivitet';
import AvbrytAktivitet from './avslutt/avbryt-aktivitet';
import FullforAktivitet from './avslutt/fullfor-aktivitet';
import NyAktivitet from './ny-aktivitet/ny-aktivitet';

function AktivitetRoutes({ match }) {
    const basePath = match.path;
    return (
        <Switch>
            <Route exact path={`${basePath}/ny`} component={NyAktivitet} />
            <Route path={`${basePath}/ny`} component={AktivitetFormContainer} />

            <Route
                exact
                path={`${basePath}/vis/:id`}
                component={AktivitetvisningContainer}
            />
            <Route
                exact
                path={`${basePath}/slett/:id`}
                component={BekreftSlettVisningContainer}
            />
            <Route
                exact
                path={`${basePath}/endre/id`}
                component={EndreAktivitet}
            />
            <Route
                exact
                path={`${basePath}/avbryt/:id`}
                component={AvbrytAktivitet}
            />
            <Route
                exact
                path={`${basePath}/fullfor/:id`}
                component={FullforAktivitet}
            />
        </Switch>
    );
}

AktivitetRoutes.propTypes = {
    match: PT.object.isRequired,
};

export default withRouter(AktivitetRoutes);
