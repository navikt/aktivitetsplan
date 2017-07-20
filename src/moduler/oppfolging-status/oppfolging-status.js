import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedHTMLMessage } from 'react-intl';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { hentSituasjon, settPrivatModus } from '../../ducks/situasjon';
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

export function oppfolgingStatusKomponent(props) {
    const {
        children,
        erVeileder,
        manuell,
        vilkarMaBesvares,
        brukerHarAvslatt,
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
    privatModus: PT.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
    visVilkar: PT.bool,
    manuell: PT.bool,
    vilkarMaBesvares: PT.bool,
    brukerHarAvslatt: PT.bool,
};

class OppfolgingStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
        if (this.props.situasjon.status === STATUS.NOT_STARTED) {
            this.props.doHentSituasjon();
        }
    }

    componentWillUpdate(nextProps) {
        if (
            nextProps.privatModus === false &&
            nextProps.erVeileder === true &&
            nextProps.underOppfolging === false
        ) {
            this.props.doSettPrivatModus();
        }
    }

    render() {
        const props = this.props;
        const { situasjon, identitet } = props;

        return (
            <Innholdslaster avhengigheter={[situasjon, identitet]}>
                <div className="fullbredde">
                    {oppfolgingStatusKomponent(props)}
                </div>
            </Innholdslaster>
        );
    }
}

OppfolgingStatus.defaultProps = {
    situasjon: undefined,
};

OppfolgingStatus.propTypes = {
    situasjon: AppPT.situasjon,
    doSettPrivatModus: PT.func.isRequired,
    doHentSituasjon: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
};

const mapStateToProps = state => {
    const situasjon = state.data.situasjon;
    const identitet = state.data.identitet;
    const situasjonData = situasjon.data;
    return {
        erVeileder: identitet.data.erVeileder,
        underOppfolging: situasjonData.underOppfolging,
        privatModus: situasjon.privatModus,
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
    doSettPrivatModus: () => dispatch(settPrivatModus()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
