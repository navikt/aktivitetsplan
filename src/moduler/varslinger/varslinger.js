import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import { hentIdentitet } from '../identitet/identitet-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';
import {
    HiddenIfVarsling,
    HiddenIfVarslingMedLenke,
} from './varsel-alertstriper';
import {
    selectVilkarMaBesvares,
    selectErUnderOppfolging,
    selectErBrukerManuell,
    selectReservasjonKRR,
    selectTilHorendeDialogId,
    selectErEskalert,
    selectOppfolgingStatus,
} from '../oppfolging-status/oppfolging-selector';
import {
    selectErBruker,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';
import { velgHistoriskPeriode } from '../filtrering/filter/filter-reducer';

class Varslinger extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
    }
    render() {
        const {
            erBruker,
            avhengigheter,
            underOppfolging,
            vilkarMaBesvares,
            brukerErManuell,
            reservertIKRR,
            brukerErEskalert,
            tilhorendeDialogId,
            doVelgNavarendePeriode,
        } = this.props;

        const visVarslingerForBruker = (
            <Container>
                <HiddenIfVarslingMedLenke
                    hidden={!brukerErEskalert}
                    tekstId="oppfolgning.bruker.bruker-er-eskalert"
                    lenkeTekstId="oppfolgning.bruker.bruker-er-eskalert.lenke-tekst"
                    href={`/dialog/${tilhorendeDialogId}`}
                    className="varsling"
                    onClick={() => {
                        doVelgNavarendePeriode();
                    }}
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
                    hidden={
                        reservertIKRR ||
                        !vilkarMaBesvares ||
                        brukerErManuell ||
                        !underOppfolging
                    }
                    tekstId="oppfolging.vilkar-ikke-godkjent"
                    className="varsling"
                />
                <HiddenIfVarsling
                    hidden={!reservertIKRR}
                    tekstId="oppfolging.bruker-reservert-i-krr"
                    className="varsling"
                />
                <HiddenIfVarslingMedLenke
                    hidden={!brukerErEskalert}
                    tekstId="oppfolgning.veileder.bruker-er-eskalert"
                    lenkeTekstId="oppfolgning.veileder.bruker-er-eskalert.lenke-tekst"
                    href={`/dialog/${tilhorendeDialogId}`}
                    className="varsling"
                    onClick={() => {
                        doVelgNavarendePeriode();
                    }}
                />
                <HiddenIfVarslingMedLenke
                    hidden={reservertIKRR || !brukerErManuell}
                    tekstId="oppfolging.bruker-er-manuell.tekst"
                    lenkeTekstId="oppfolging.bruker-er-manuell.lenke-tekst"
                    href="/innstillinger/digital"
                    className="varsling"
                />
            </Container>
        );

        return (
            <Innholdslaster avhengigheter={avhengigheter}>
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
    historiskVisning: false,
    tilhorendeDialogId: undefined,
};

Varslinger.propTypes = {
    erBruker: PT.bool,
    avhengigheter: AppPT.avhengigheter.isRequired,
    underOppfolging: PT.bool,
    vilkarMaBesvares: PT.bool,
    brukerErManuell: PT.bool,
    reservertIKRR: PT.bool,
    doHentIdentitet: PT.func.isRequired,
    doVelgNavarendePeriode: PT.func.isRequired,
    brukerErEskalert: PT.bool,
    tilhorendeDialogId: PT.number,
};

const mapStateToProps = state => ({
    erBruker: selectErBruker(state),
    avhengigheter: [
        selectOppfolgingStatus(state),
        selectIdentitetStatus(state),
    ],
    vilkarMaBesvares: selectVilkarMaBesvares(state),
    underOppfolging: selectErUnderOppfolging(state),
    brukerErManuell: selectErBrukerManuell(state),
    reservertIKRR: selectReservasjonKRR(state),
    brukerErEskalert: selectErEskalert(state),
    tilhorendeDialogId: selectTilHorendeDialogId(state),
});

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
    doVelgNavarendePeriode: () => dispatch(velgHistoriskPeriode(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Varslinger);
