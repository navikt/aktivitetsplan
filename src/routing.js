import React from 'react';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import Aktivitetsmal from './moduler/mal/mal';
import AktivitetRoutes from './moduler/aktivitet/aktivitet-routes';
import AktivitetsplanPrint from './moduler/utskrift/aktivitetsplanprint';
import InformasjonModal from './moduler/informasjon/informasjon-modal';

function getPathWithBase(path) {
    if (window.appconfig.FNR_I_URL) {
        return `/:fnr${path}`;
    }
    return path;
}

const Routing = ({ location }) => (
    <Switch location={location}>
        <Route path={getPathWithBase('/mal')} component={Aktivitetsmal} />
        <Route path={getPathWithBase('/aktivitet')} component={AktivitetRoutes} />
        <Route path={getPathWithBase('/utskrift')} component={AktivitetsplanPrint} />
    </Switch>
);

Routing.propTypes = {
    location: PT.object.isRequired
};

function Public({ location }) {
    return (
        <Switch location={location}>
            <Route path={getPathWithBase('/informasjon')} component={InformasjonModal} />
        </Switch>
    );
}

Public.propTypes = {
    location: PT.object.isRequired
};

export const PublicRouting = withRouter(Public);

export default withRouter(Routing);
