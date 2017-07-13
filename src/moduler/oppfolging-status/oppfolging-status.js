import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedHTMLMessage } from 'react-intl';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { hentSituasjon } from '../../ducks/situasjon';
import { hentIdentitet } from '../../ducks/identitet';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../ducks/utils';
import visibleIfHOC from '../../hocs/visible-if';
import GodkjennVilkar from '../vilkar/godkjenn-vilkar';
import SettDigital from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';

const Alert = visibleIfHOC(AlertStripeInfoSolid);

function GodkjennVilkarMedVarsling({ visVilkar, brukerHarAvslatt }) {
    return (
        <div>
            <Alert visible={!visVilkar && brukerHarAvslatt}>
                <FormattedHTMLMessage id="vilkar.info-avslag-vilkar" />
            </Alert>
            <GodkjennVilkar visVilkar={visVilkar} />
        </div>
    );
}

GodkjennVilkarMedVarsling.defaultProps = {
    brukerHarAvslatt: null,
};

GodkjennVilkarMedVarsling.propTypes = {
    brukerHarAvslatt: PT.bool,
    visVilkar: PT.bool.isRequired,
};

class OppfolgingStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
        if (this.props.situasjon.status === STATUS.NOT_STARTED) {
            this.props.doHentSituasjon();
        }
    }

    render() {
        const {
            children,
            situasjon,
            identitet,
            visVilkar,
            reservasjonKRR,
            manuell,
            vilkarMaBesvares,
            brukerHarAvslatt,
            erVeileder,
        } = this.props;

        let komponent;
        if (erVeileder) {
            komponent = children;
        } else if (manuell) {
            komponent = <SettDigital />;
        } else if (reservasjonKRR) {
            komponent = (
                <AlertStripeInfoSolid className="oppfolgingstatus__krr-varsling">
                    <FormattedHTMLMessage id="krr.reservasjon" />
                </AlertStripeInfoSolid>
            );
        } else if (vilkarMaBesvares) {
            komponent = (
                <GodkjennVilkarMedVarsling
                    visVilkar={visVilkar}
                    brukerHarAvslatt={brukerHarAvslatt}
                />
            );
        } else {
            komponent = children;
        }

        return (
            <Innholdslaster avhengigheter={[situasjon, identitet]}>
                <div className="fullbredde">
                    {komponent}
                </div>
            </Innholdslaster>
        );
    }
}

OppfolgingStatus.defaultProps = {
    children: null,
    erVeileder: null,
    reservasjonKRR: null,
    manuell: null,
    vilkarMaBesvares: null,
    brukerHarAvslatt: null,
    visVilkar: false,
};

OppfolgingStatus.propTypes = {
    children: PT.node,
    identitet: AppPT.reducer.isRequired,
    erVeileder: PT.bool,
    visVilkar: PT.bool,
    situasjon: AppPT.situasjon.isRequired,
    doHentSituasjon: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
    reservasjonKRR: PT.bool,
    manuell: PT.bool,
    vilkarMaBesvares: PT.bool,
    brukerHarAvslatt: PT.bool,
};

const mapStateToProps = state => {
    const situasjon = state.data.situasjon;
    const identitet = state.data.identitet;
    const situasjonData = situasjon.data;
    return {
        erVeileder: identitet.data.erVeileder,
        brukerHarAvslatt: situasjon.brukerHarAvslatt,
        reservasjonKRR: situasjonData.reservasjonKRR,
        manuell: situasjonData.manuell,
        vilkarMaBesvares: situasjonData.vilkarMaBesvares,
        situasjon,
        identitet,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentSituasjon: () => dispatch(hentSituasjon()),
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
