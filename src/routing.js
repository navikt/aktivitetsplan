import PT from 'prop-types';
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import AktivitetRoutes from './moduler/aktivitet/aktivitet-routes';
import InformasjonModal from './moduler/informasjon/informasjon-modal';
import Aktivitetsmal from './moduler/mal/mal';
import AktivitetsplanPrint from './moduler/utskrift/aktivitetsplanprint';

const Fallback = (props) => {
    console.log({ fallback: props })
    return <div>lol</div>
}

const Routing = () => {
    return (<Switch>
        <Route path={'/mal'} component={Aktivitetsmal}/>
        <Route path={'/aktivitet'} component={AktivitetRoutes}/>
        <Route path={'/utskrift'} component={AktivitetsplanPrint}/>
        <Route path={"/12345678910"} component={Fallback} />
    </Switch>)
};

Routing.propTypes = {
    location: PT.object.isRequired,
};

function Public({ location }) {
    return (
        <Switch location={location}>
            <Route path={'/informasjon'} component={InformasjonModal} />
        </Switch>
    );
}

Public.propTypes = {
    location: PT.object.isRequired,
};

export const PublicRouting = withRouter(Public);

export default withRouter(Routing);
