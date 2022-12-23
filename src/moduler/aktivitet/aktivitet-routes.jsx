import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AvbrytAktivitet from './avslutt/AvbrytAktivitet';
import FullforAktivitet from './avslutt/fullfor-aktivitet';
import LeggTilForm from './ny-aktivitet/LeggTilForm';
import NyAktivitetForm from './ny-aktivitet/ny-aktivitet-form';
import EndreAktivitet from './rediger/endre-aktivitet';
import AktivitetvisningContainer from './visning/aktivitetvisning-container';

function AktivitetRoutes({ match }) {
    const basePath = match.path;
    return (
        <Switch>
            <Route exact path={`${basePath}/ny`} component={LeggTilForm} />
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
