import React from 'react';
import PT from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import AktivitetFormContainer from './aktivitet-forms/aktivitet-form-container';
import AktivitetvisningContainer from './visning/aktivitetvisning-container';
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
                component={props =>
                    <AktivitetvisningContainer
                        aktivitetId={props.match.params.id}
                        {...props}
                    />}
            />
            <Route
                exact
                path={`${basePath}/endre/:id`}
                component={props =>
                    <EndreAktivitet
                        aktivitetId={props.match.params.id}
                        {...props}
                    />}
            />
            <Route
                exact
                path={`${basePath}/avbryt/:id`}
                component={props =>
                    <AvbrytAktivitet
                        aktivitetId={props.match.params.id}
                        {...props}
                    />}
            />
            <Route
                exact
                path={`${basePath}/fullfor/:id`}
                component={props =>
                    <FullforAktivitet
                        aktivitetId={props.match.params.id}
                        {...props}
                    />}
            />
        </Switch>
    );
}

AktivitetRoutes.propTypes = {
    match: PT.object.isRequired,
};

export default AktivitetRoutes;
