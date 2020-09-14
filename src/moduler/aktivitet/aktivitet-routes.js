import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import NyAktivitetForm from './ny-aktivitet/ny-aktivitet-form';
import AktivitetvisningContainer from './visning/aktivitetvisning-container';
import EndreAktivitet from './rediger/endre-aktivitet';
import AvbrytAktivitet from './avslutt/avbryt-aktivitet';
import FullforAktivitet from './avslutt/fullfor-aktivitet';
import NyAktivitetVelger from './ny-aktivitet/ny-aktivitet';

function AktivitetRoutes({ match }) {
    const basePath = match.path;
    return (
        <Switch>
            <Route exact path={`${basePath}/ny`} component={NyAktivitetVelger} />
            <Route path={`${basePath}/ny`} component={NyAktivitetForm} />

            <Route exact path={`${basePath}/vis/:id`} component={AktivitetvisningContainer} />
            <Route exact path={`${basePath}/endre/:id`} component={EndreAktivitet} />
            <Route exact path={`${basePath}/avbryt/:id`} component={AvbrytAktivitet} />
            <Route exact path={`${basePath}/fullfor/:id`} component={FullforAktivitet} />
        </Switch>
    );
}

AktivitetRoutes.propTypes = {
    match: PT.object.isRequired,
};

export default AktivitetRoutes;
