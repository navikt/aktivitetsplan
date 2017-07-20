import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import { hentIdentitet } from '../../ducks/identitet';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';
import {
    HiddenIfVarsling,
    HiddenIfVarslingMedLenke,
} from './varsel-alertstriper';
import { div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';

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
            reservertIKRR,
        } = this.props;
        return (
            <Innholdslaster
                avhengigheter={[situasjonReducer, identitetReducer]}
            >
                <HiddenIfDiv hidden={erBruker}>
                    <Container>
                        <HiddenIfVarsling
                            hidden={underOppfolging}
                            tekstId="oppfolging.ikke-under-oppfolging"
                            className="varsling"
                        />
                        <HiddenIfVarsling
                            hidden={!vilkarMaBesvares}
                            tekstId="oppfolging.vilkar-ikke-godkjent"
                            className="varsling"
                        />
                        <HiddenIfVarsling
                            hidden={!reservertIKRR || reservertIKRR}
                            tekstId="oppfolging.bruker-reservert-i-krr"
                            className="varsling"
                        />
                        <HiddenIfVarslingMedLenke
                            hidden={reservertIKRR || !brukerErManuell}
                            tekstId="oppfolging.bruker-er-manuell.tekst"
                            lenkeTekstId="oppfolging.bruker-er-manuell.lenke-tekst"
                            href="/innstillinger"
                            className="varsling"
                        />
                    </Container>
                </HiddenIfDiv>
            </Innholdslaster>
        );
    }
}

Varslinger.defaultProps = {
    erBruker: false,
    underOppfolging: false,
    vilkarMaBesvares: false,
    brukerErManuell: false,
    reservertIKRR: false,
};

Varslinger.propTypes = {
    identitetReducer: AppPT.reducer.isRequired,
    erBruker: PT.bool,
    situasjonReducer: AppPT.reducer.isRequired,
    underOppfolging: PT.bool,
    vilkarMaBesvares: PT.bool,
    brukerErManuell: PT.bool,
    reservertIKRR: PT.bool,
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
        reservertIKRR: oppfolgingStatus.reservasjonKRR,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Varslinger);
