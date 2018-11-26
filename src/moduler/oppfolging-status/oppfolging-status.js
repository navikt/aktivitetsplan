import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { hentOppfolging } from './oppfolging-reducer';
import { hentIdentitet } from '../identitet/identitet-reducer';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../ducks/utils';
import visibleIfHOC from '../../hocs/visible-if';
import GodkjennVilkar from '../vilkar/godkjenn-vilkar';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';

import {
    selectBrukerHarAvslatt,
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectOppfolgingStatus,
    selectVilkarMaBesvares,
} from './oppfolging-selector';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';
import { HtmlText } from '../../text';
import { erPrivateBrukerSomSkalSkrusAv } from '../privat-modus/privat-modus-selector';
import {
    selectFeatureData,
    selectFeatureStatus,
} from '../../felles-komponenter/feature/feature-selector';
import {
    BRUKERVILKAR,
    harFeature,
} from '../../felles-komponenter/feature/feature';

export const Alert = visibleIfHOC(AlertStripeInfoSolid);

export function GodkjennVilkarMedVarsling({ visVilkar, brukerHarAvslatt }) {
    return (
        <div>
            <Alert
                className="feil-container"
                visible={!visVilkar && brukerHarAvslatt}
            >
                <HtmlText id="vilkar.info-avslag-vilkar" />
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

export function oppfolgingStatusKomponent(props) {
    const {
        children,
        erVeileder,
        manuell,
        vilkarMaBesvares,
        brukerHarAvslatt,
        visVilkar,
        privateModus,
        vilkarToggletAv,
    } = props;

    const skalVilkaarBesvares =
        vilkarMaBesvares && !(privateModus || vilkarToggletAv);
    if (erVeileder) {
        return children;
    } else if (manuell) {
        return <AktiverDigitalOppfolging />;
    } else if (skalVilkaarBesvares) {
        return (
            <GodkjennVilkarMedVarsling
                visVilkar={!!visVilkar}
                brukerHarAvslatt={brukerHarAvslatt}
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
};

oppfolgingStatusKomponent.propTypes = {
    children: PT.node,
    erVeileder: PT.bool,
    underOppfolging: PT.bool, // eslint-disable-line react/no-unused-prop-types
    visVilkar: PT.bool,
    manuell: PT.bool,
    vilkarMaBesvares: PT.bool,
    brukerHarAvslatt: PT.bool,
    privateModus: PT.bool.isRequired,
    vilkarToggletAv: PT.bool.isRequired,
};

class OppfolgingStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
        if (this.props.oppfolgingStatus === STATUS.NOT_STARTED) {
            this.props.doHentOppfolging();
        }
    }

    render() {
        const props = this.props;

        return (
            <Innholdslaster
                avhengigheter={[
                    props.oppfolgingStatus,
                    props.identitetStatus,
                    props.toggleStatus,
                ]}
            >
                <div className="fullbredde">
                    {oppfolgingStatusKomponent(props)}
                </div>
            </Innholdslaster>
        );
    }
}
OppfolgingStatus.propTypes = {
    oppfolgingStatus: AppPT.status.isRequired,
    identitetStatus: AppPT.status.isRequired,
    toggleStatus: AppPT.status.isRequired,
    doHentOppfolging: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
    privateModus: PT.bool.isRequired,
    vilkarToggletAv: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
    underOppfolging: selectErUnderOppfolging(state),
    brukerHarAvslatt: selectBrukerHarAvslatt(state),
    manuell: selectErBrukerManuell(state),
    vilkarMaBesvares: selectVilkarMaBesvares(state),
    oppfolgingStatus: selectOppfolgingStatus(state),
    identitetStatus: selectIdentitetStatus(state),
    privateModus: erPrivateBrukerSomSkalSkrusAv(state),
    vilkarToggletAv: harFeature(BRUKERVILKAR, selectFeatureData(state)),
    toggleStatus: selectFeatureStatus(state),
});

const mapDispatchToProps = dispatch => ({
    doHentOppfolging: () => dispatch(hentOppfolging()),
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
