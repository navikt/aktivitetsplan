import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedHTMLMessage } from 'react-intl';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { hentSituasjon } from '../situasjon/situasjon';
import { hentIdentitet } from '../identitet/identitet-duck';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../ducks/utils';
import visibleIfHOC from '../../hocs/visible-if';
import GodkjennVilkar from '../vilkar/godkjenn-vilkar';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';
import { selectErPrivatBruker } from '../privat-modus/privat-modus-selector';
import {
    selectBrukerHarAvslatt,
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectSituasjonStatus,
    selectVilkarMaBesvares,
} from '../situasjon/situasjon-selector';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';

export const Alert = visibleIfHOC(AlertStripeInfoSolid);

export function GodkjennVilkarMedVarsling({
    visVilkar,
    brukerHarAvslatt,
    erPrivatBruker,
}) {
    const visTekstForPrivatBruker = erPrivatBruker
        ? 'PRIVAT_BRUKER'
        : 'DEFAULT';
    return (
        <div>
            <Alert
                className="feil-container"
                visible={!visVilkar && brukerHarAvslatt}
            >
                <FormattedHTMLMessage
                    id="vilkar.info-avslag-vilkar"
                    values={{ status: visTekstForPrivatBruker }}
                />
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
    erPrivatBruker: PT.bool.isRequired,
};

export function oppfolgingStatusKomponent(props) {
    const {
        children,
        erVeileder,
        manuell,
        vilkarMaBesvares,
        brukerHarAvslatt,
        erPrivatBruker,
        visVilkar,
    } = props;
    if (erVeileder) {
        return children;
    } else if (manuell) {
        return <AktiverDigitalOppfolging />;
    } else if (vilkarMaBesvares) {
        return (
            <GodkjennVilkarMedVarsling
                visVilkar={visVilkar}
                brukerHarAvslatt={brukerHarAvslatt}
                erPrivatBruker={erPrivatBruker}
            />
        );
    }
    return children;
}

oppfolgingStatusKomponent.defaultProps = {
    children: null,
    erVeileder: null,
    manuell: null,
    underOppfolging: null,
    reservasjonKRR: null,
    vilkarMaBesvares: null,
    brukerHarAvslatt: null,
    visVilkar: false,
    erPrivatBruker: false,
};

oppfolgingStatusKomponent.propTypes = {
    children: PT.node,
    erVeileder: PT.bool,
    underOppfolging: PT.bool, // eslint-disable-line react/no-unused-prop-types
    visVilkar: PT.bool,
    manuell: PT.bool,
    vilkarMaBesvares: PT.bool,
    brukerHarAvslatt: PT.bool,
    erPrivatBruker: PT.bool,
};

class OppfolgingStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
        if (this.props.situasjonStatus === STATUS.NOT_STARTED) {
            this.props.doHentSituasjon();
        }
    }

    render() {
        const props = this.props;

        return (
            <Innholdslaster
                avhengigheter={[props.situasjonStatus, props.identitetStatus]}
            >
                <div className="fullbredde">
                    {oppfolgingStatusKomponent(props)}
                </div>
            </Innholdslaster>
        );
    }
}
OppfolgingStatus.propTypes = {
    situasjonStatus: AppPT.status.isRequired,
    identitetStatus: AppPT.status.isRequired,
    doHentSituasjon: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
};

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
    underOppfolging: selectErUnderOppfolging(state),
    brukerHarAvslatt: selectBrukerHarAvslatt(state),
    manuell: selectErBrukerManuell(state),
    vilkarMaBesvares: selectVilkarMaBesvares(state),
    situasjonStatus: selectSituasjonStatus(state),
    identitetStatus: selectIdentitetStatus(state),
    erPrivatBruker: selectErPrivatBruker(state),

});

const mapDispatchToProps = dispatch => ({
    doHentSituasjon: () => dispatch(hentSituasjon()),
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
