import 'babel-polyfill';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FNR_I_URL } from '~config'; //eslint-disable-line
import { Route, Switch, withRouter } from 'react-router-dom';
import VilkarModalMedHistorikk from './moduler/vilkar/vilkar-med-historikk';
import VilkarModalUtenHistorikk from './moduler/vilkar/vilkar-uten-historikk';
import DialogModal from './moduler/dialog/dialog-modal/dialog-modal';
import AktivitetmalEndre from './moduler/mal/aktivitetsmal-endre';
import Aktivitetsmal from './moduler/mal/aktivitetsmal';
import AktivitetmalSlett from './moduler/mal/aktivitetsmal-slett';
import AktivitetRoutes from './moduler/aktivitet/aktivitet-routes';
import ArbeidslisteContainer from './moduler/arbeidsliste/arbeidsliste-container';
import AktivitetsplanPrint from './moduler/utskrift/aktivitetsplanprint';
import InnstillingerRoutes from './moduler/innstillinger/innstillinger-routes';
import { harFeature } from './felles-komponenter/feature/feature';
import { selectFeatureData } from './felles-komponenter/feature/feature-selector';
import InformasjonModal from './moduler/informasjon/informasjon-modal';
import VideoModal from './moduler/informasjon/video-modal'; // eslint-disable-line

export const aktivitetRoute = aktivitetId => `/aktivitet/vis/${aktivitetId}`;
export const endreAktivitetRoute = aktivitetId =>
    `/aktivitet/endre/${aktivitetId}`;
export const fullforAktivitetRoute = aktivitetId =>
    `/aktivitet/fullfor/${aktivitetId}`;
export const avbrytAktivitetRoute = aktivitetId =>
    `/aktivitet/avbryt/${aktivitetId}`;

function getPathWithBase(path) {
    if (FNR_I_URL) {
        return `/:fnr${path}`;
    }
    return path;
}

const Routing = ({ location }) =>
    <Switch location={location}>
        <Route exact path={getPathWithBase('/mal')} component={Aktivitetsmal} />
        <Route
            path={getPathWithBase('/mal/endre')}
            component={AktivitetmalEndre}
        />
        <Route
            path={getPathWithBase('/mal/slett')}
            component={AktivitetmalSlett}
        />
        <Route
            exact
            path={getPathWithBase('/dialog')}
            component={DialogModal}
        />
        <Route
            exact
            path={getPathWithBase('/dialog/:id')}
            component={DialogModal}
        />
        <Route
            path={getPathWithBase('/aktivitet')}
            component={AktivitetRoutes}
        />
        <Route
            path={getPathWithBase('/innstillinger')}
            component={InnstillingerRoutes}
        />
        <Route
            path={getPathWithBase('/arbeidsliste')}
            component={ArbeidslisteContainer}
        />
        <Route
            path={getPathWithBase('/utskrift')}
            component={AktivitetsplanPrint}
        />
    </Switch>;

Routing.propTypes = {
    location: PT.object.isRequired,
};

function Public({ location, features }) {
    const brukervilkarFeature = harFeature('brukervilkar', features);
    const FeaturedInformasjon = brukervilkarFeature
        ? InformasjonModal
        : VideoModal;

    return (
        <Switch location={location}>
            <Route
                exact
                path={getPathWithBase('/vilkar')}
                component={VilkarModalMedHistorikk}
            />
            <Route
                path={getPathWithBase('/vilkar/:key')}
                component={VilkarModalUtenHistorikk}
            />
            <Route
                path={getPathWithBase('/informasjon')}
                component={FeaturedInformasjon}
            />
        </Switch>
    );
}

Public.propTypes = {
    location: PT.object.isRequired,
    features: PT.object.isRequired,
};

const mapStateToProps = state => ({
    features: selectFeatureData(state),
});

export const PublicRouting = withRouter(connect(mapStateToProps)(Public));

export default withRouter(Routing);

export function selectRouteParams(props) {
    const match = props && props.match;
    const params = match && match.params;
    return params || {};
}
