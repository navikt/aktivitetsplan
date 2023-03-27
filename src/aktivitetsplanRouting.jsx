import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AktivitetRoutes from './moduler/aktivitet/aktivitet-routes';
import InformasjonModal from './moduler/informasjon/informasjon-modal';
import Aktivitetsmal from './moduler/mal/mal';

const AktivitetsplanRouting = () => {
    return (
        <Switch>
            <Route path={'/mal'} component={Aktivitetsmal} />
            <Route path={'/aktivitet'} component={AktivitetRoutes} />
        </Switch>
    );
};

function Public() {
    return (
        <Switch>
            <Route path={'/informasjon'} component={InformasjonModal} />
        </Switch>
    );
}

export const PublicRouting = Public;

export default AktivitetsplanRouting;
