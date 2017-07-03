import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { hentIdentitet } from '../../ducks/identitet';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';
import hiddenIf, {
    div as HiddenIfDiv,
} from '../../felles-komponenter/hidden-if/hidden-if';
import Lenke from '../../felles-komponenter/utils/lenke';

const Varsling = hiddenIf(({ tekstId }) => (
    <AlertStripeInfoSolid>
        <FormattedMessage id={tekstId} />
    </AlertStripeInfoSolid>
));

const VarslingMedLenke = hiddenIf(({ tekstId, lenkeTekstId, href }) => (
    <AlertStripeInfoSolid>
        <FormattedMessage id={tekstId} />
        <Lenke href={href}><FormattedMessage id={lenkeTekstId} /></Lenke>
    </AlertStripeInfoSolid>
));

class Varslinger extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
    }

    render() {
        const {
            identitetReducer,
            erBruker,
            situasjonReducer,
            underOppfolging,
            vilkarMaBesvares,
            brukerErManuell,
        } = this.props;
        return (
            <Innholdslaster
                avhengigheter={[situasjonReducer, identitetReducer]}
            >
                <HiddenIfDiv hidden={erBruker} className="varsling-container">
                    <Varsling
                        hidden={underOppfolging}
                        tekstId="oppfolging.ikke-under-oppfolging"
                    />
                    <Varsling
                        hidden={!vilkarMaBesvares}
                        tekstId="oppfolging.vilkar-ikke-godkjent"
                    />
                    <VarslingMedLenke
                        hidden={!brukerErManuell}
                        tekstId="oppfolging.bruker-er-manuell.tekst"
                        lenkeTekstId="oppfolging.bruker-er-manuell.lenke-tekst"
                        href="/innstillinger"
                    />
                </HiddenIfDiv>
            </Innholdslaster>
        );
    }
}

Varslinger.propTypes = {
    identitetReducer: AppPT.reducer.isRequired,
    erBruker: PT.bool.isRequired,
    situasjonReducer: AppPT.reducer.isRequired,
    underOppfolging: PT.bool.isRequired,
    vilkarMaBesvares: PT.bool.isRequired,
    brukerErManuell: PT.bool.isRequired,
    doHentIdentitet: PT.func.isRequired,
};

const mapStateToProps = state => {
    const stateData = state.data;
    const identitetReducer = stateData.identitet;
    const situasjonReducer = stateData.situasjon;
    const oppfolgingStatus = situasjonReducer.data;
    return {
        identitetReducer,
        erBruker: identitetReducer.data.erBruker,

        situasjonReducer,
        vilkarMaBesvares: oppfolgingStatus.vilkarMaBesvares,
        underOppfolging: oppfolgingStatus.underOppfolging,
        brukerErManuell: oppfolgingStatus.manuell,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Varslinger);
