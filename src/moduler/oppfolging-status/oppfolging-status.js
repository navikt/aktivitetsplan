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
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';

export const Alert = visibleIfHOC(AlertStripeInfoSolid);

export function GodkjennVilkarMedVarsling({ visVilkar, brukerHarAvslatt }) {
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

export function oppfolgingStatusKomponent(
    children,
    erVeileder,
    manuell,
    vilkarMaBesvares,
    brukerHarAvslatt,
    visVilkar
) {
    if (erVeileder) {
        return children;
    } else if (manuell) {
        return <AktiverDigitalOppfolging />;
    } else if (vilkarMaBesvares) {
        return (
            <GodkjennVilkarMedVarsling
                visVilkar={visVilkar}
                brukerHarAvslatt={brukerHarAvslatt}
            />
        );
    }
    return children;
}

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
            manuell,
            vilkarMaBesvares,
            brukerHarAvslatt,
            erVeileder,
        } = this.props;

        return (
            <Innholdslaster avhengigheter={[situasjon, identitet]}>
                <div className="fullbredde">
                    {oppfolgingStatusKomponent(
                        children,
                        visVilkar,
                        manuell,
                        vilkarMaBesvares,
                        brukerHarAvslatt,
                        erVeileder
                    )}
                </div>
            </Innholdslaster>
        );
    }
}

OppfolgingStatus.defaultProps = {
    children: null,
    erVeileder: null,
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
