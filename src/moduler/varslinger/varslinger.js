import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import { hentIdentitet } from '../identitet/identitet-duck';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';
import {
    HiddenIfVarsling,
    HiddenIfVarslingMedLenke,
} from './varsel-alertstriper';
import {
    selectGjeldendeEskaleringsVarsel,
    selectVilkarMaBesvares,
    selectErUnderOppfolging,
    selectErBrukerManuell,
    selectReservasjonKRR,
    selectSituasjonReducer,
    selectTilHorendeDialogId,
} from '../situasjon/situasjon-selector';
import {
    selectErBruker,
    selectIdentitetReducer,
} from '../identitet/identitet-selector';

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
            brukerErEskalert,
            tilhorendeDialogId,
        } = this.props;

        const visVarslingerForBruker = (
            <Container>
                <HiddenIfVarslingMedLenke
                    hidden={!brukerErEskalert}
                    tekstId="oppfolgning.bruker.bruker-er-eskalert  "
                    lenkeTekstId="oppfolgning.bruker.bruker-er-eskalert.lenke-tekst"
                    href={`/dialog/${tilhorendeDialogId}`}
                    className="varsling"
                />
            </Container>
        );

        const visVarslingerForVeileder = (
                <Container>
                    <HiddenIfVarsling
                        hidden={underOppfolging}
                        tekstId="oppfolging.ikke-under-oppfolging"
                        className="varsling"
                    />
                    <HiddenIfVarsling
                        hidden={reservertIKRR || !vilkarMaBesvares || brukerErManuell}
                        tekstId="oppfolging.vilkar-ikke-godkjent"
                        className="varsling"
                    />
                    <HiddenIfVarsling
                        hidden={!reservertIKRR}
                        tekstId="oppfolging.bruker-reservert-i-krr"
                        className="varsling"
                    />
                    <HiddenIfVarsling
                        hidden={!brukerErEskalert}
                        tekstId="oppfolgning.veileder.bruker-er-eskalert"
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
        );

        return (
            <Innholdslaster
                avhengigheter={[situasjonReducer, identitetReducer]}>
                {erBruker ? visVarslingerForBruker : visVarslingerForVeileder}
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
    brukerErEskalert: false,
    tilhorendeDialogId: undefined,
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
    brukerErEskalert: PT.bool,
    tilhorendeDialogId: PT.number,
};

const mapStateToProps = state => ({
    identitetReducer: selectIdentitetReducer(state),
    erBruker: selectErBruker(state),
    situasjonReducer: selectSituasjonReducer(state),
    vilkarMaBesvares: selectVilkarMaBesvares(state),
    underOppfolging: selectErUnderOppfolging(state),
    brukerErManuell: selectErBrukerManuell(state),
    reservertIKRR: selectReservasjonKRR(state),
    brukerErEskalert: selectGjeldendeEskaleringsVarsel(state),
    tilhorendeDialogId: selectTilHorendeDialogId(state),

});

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Varslinger);
