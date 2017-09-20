import React from 'react';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import InformasjonModal from './informasjon-modal';

function InformasjonRoutes({ match }) {
    const basePath = match.path;
    return (
        <Switch>
            <Route exact path={`${basePath}/`} component={InformasjonModal} />
        </Switch>
    );
}

InformasjonRoutes.propTypes = {
    match: PT.object.isRequired,
};

export default withRouter(InformasjonRoutes);
