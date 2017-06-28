import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedHTMLMessage } from 'react-intl';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { hentSituasjon } from '../../ducks/situasjon';
import { hentIdentitet } from '../../ducks/identitet';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../ducks/utils';
import visibleIfHOC from '../../hocs/visible-if';
import Vilkar from './vilkar';

const Alert = visibleIfHOC(AlertStripeInfoSolid);

function AksepterVilkar({ visVilkar, vilkarMaBesvares, brukerHarAvslatt }) {
    return (
        <div>
            <Alert visible={!visVilkar && brukerHarAvslatt}>
                <FormattedHTMLMessage id="vilkar.info-avslag-vilkar" />
            </Alert>
            <Vilkar visVilkar={visVilkar} visGodkjenning={vilkarMaBesvares} />
        </div>
    );
}

AksepterVilkar.defaultProps = {
    vilkarMaBesvares: null,
    brukerHarAvslatt: null,
};

AksepterVilkar.propTypes = {
    brukerHarAvslatt: PT.bool,
    visVilkar: PT.bool.isRequired,
    vilkarMaBesvares: PT.bool,
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
            vilkarMaBesvares,
            brukerHarAvslatt,
            erVeileder,
        } = this.props;

        let komponent;
        if (erVeileder) {
            komponent = children;
        } else if (reservasjonKRR) {
            komponent = (
                <AlertStripeInfoSolid className="oppfolgingstatus__krr-varsling">
                    <FormattedHTMLMessage id="krr.reservasjon" />
                </AlertStripeInfoSolid>
            );
        } else if (visVilkar || vilkarMaBesvares) {
            komponent = (
                <AksepterVilkar
                    visVilkar={visVilkar}
                    vilkarMaBesvares={vilkarMaBesvares}
                    brukerHarAvslatt={brukerHarAvslatt}
                />
            );
        } else {
            komponent = children;
        }

        return (
            <Innholdslaster avhengigheter={[situasjon, identitet]}>
                <div className="fullbredde">{komponent}</div>
            </Innholdslaster>
        );
    }
}

OppfolgingStatus.defaultProps = {
    children: null,
    erVeileder: null,
    reservasjonKRR: null,
    vilkarMaBesvares: null,
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
    vilkarMaBesvares: PT.bool,
    brukerHarAvslatt: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const situasjon = state.data.situasjon;
    const identitet = state.data.identitet;
    const situasjonData = situasjon.data;
    return {
        erVeileder: identitet.data.erVeileder,
        brukerHarAvslatt: situasjonData.brukerHarAvslatt,
        reservasjonKRR: situasjonData.reservasjonKRR,
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
