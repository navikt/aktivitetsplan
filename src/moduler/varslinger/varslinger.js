import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { moment } from '../../utils';
import { hentIdentitet } from '../identitet/identitet-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';
import { HiddenIfVarslingMedLenke, HiddenIfAdvarselMedLenke } from './varsel-alertstriper';
import {
    selectErUnderOppfolging,
    selectTilHorendeDialogId,
    selectErEskalert,
    selectOppfolgingStatus,
    selectInaktiveringsDato,
    selectKanReaktiveres
} from '../oppfolging-status/oppfolging-selector';
import { selectErBruker, selectIdentitetStatus } from '../identitet/identitet-selector';
import { velgHistoriskPeriode } from '../filtrering/filter/filter-reducer';
import { hentOppfolging } from '../oppfolging-status/oppfolging-reducer';
import { arbeidssokerregistreringHref } from '../oppfolging-status/har-ikke-aktivitetsplan';

class Varslinger extends Component {
    componentDidMount() {
        const { doHentIdentitet, doHentOppfolging, erBruker } = this.props;
        doHentIdentitet();
        if (erBruker) {
            doHentOppfolging();
        }
    }

    hentInfotekstTilInaktivertBrukere() {
        const { antallDagerIgjen } = this.props;
        const antallDagerIgjenMerEnn10 = antallDagerIgjen <= 28 && antallDagerIgjen >= 10;
        const antallDagerIgjenMindreEnn10 = antallDagerIgjen < 10 && antallDagerIgjen >= 1;

        if (antallDagerIgjenMerEnn10) {
            return 'oppfolging.inaktivert-28-til-10-dager.reaktiveres';
        }
        if (antallDagerIgjenMindreEnn10) {
            return 'oppfolging.inaktivert-mindre-enn-10-dager.reaktiveres';
        }
        return 'oppfolging.inaktivert-mer-enn-28-dager.reaktiveres';
    }

    render() {
        const {
            erBruker,
            avhengigheter,
            underOppfolging,
            brukerErEskalert,
            tilhorendeDialogId,
            doVelgNavarendePeriode,
            kanReaktiveres,
            antallDagerIgjen
        } = this.props;

        if (!erBruker) {
            return null;
        }

        const reaktiveringsInfoTekst = this.hentInfotekstTilInaktivertBrukere();

        const visVarslingerForBruker = (
            <div className="container">
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
                <HiddenIfAdvarselMedLenke
                    hidden={!kanReaktiveres}
                    tekstId={reaktiveringsInfoTekst}
                    className="varsling"
                    lenkeTekstId="oppfolging.ikke-under-oppfolging.reaktiveres.lenke-tekst"
                    href={arbeidssokerregistreringHref}
                    values={{ antalldagerIgjen: antallDagerIgjen }}
                />
                <HiddenIfAdvarselMedLenke
                    hidden={underOppfolging}
                    tekstId="ikke.under.oppfolging.reaktivering"
                    className="varsling"
                    lenkeTekstId="ikke.under.oppfolging.reaktivering.lenke"
                    href={arbeidssokerregistreringHref}
                    values={{ antalldagerIgjen: antallDagerIgjen }}
                />
            </div>
        );

        return <Innholdslaster avhengigheter={avhengigheter}>{visVarslingerForBruker}</Innholdslaster>;
    }
}

Varslinger.defaultProps = {
    erBruker: false,
    underOppfolging: false,
    brukerErEskalert: false,
    tilhorendeDialogId: undefined,
    kanReaktiveres: false,
    antallDagerIgjen: undefined
};

Varslinger.propTypes = {
    erBruker: PT.bool,
    avhengigheter: AppPT.avhengigheter.isRequired,
    underOppfolging: PT.bool,
    doHentIdentitet: PT.func.isRequired,
    doVelgNavarendePeriode: PT.func.isRequired,
    brukerErEskalert: PT.bool,
    tilhorendeDialogId: PT.number,
    doHentOppfolging: PT.func.isRequired,
    kanReaktiveres: PT.bool,
    antallDagerIgjen: PT.number
};

const mapStateToProps = state => {
    const dagensDato = moment();
    const inaktiveringsdato = selectInaktiveringsDato(state);
    const dato28dagerEtterIserv = moment(inaktiveringsdato).add(28, 'day');
    const antalldagerIgjen = dato28dagerEtterIserv.diff(dagensDato, 'days');

    return {
        erBruker: selectErBruker(state),
        avhengigheter: [selectOppfolgingStatus(state), selectIdentitetStatus(state)],
        underOppfolging: selectErUnderOppfolging(state),
        brukerErEskalert: selectErEskalert(state),
        tilhorendeDialogId: selectTilHorendeDialogId(state),
        kanReaktiveres: selectKanReaktiveres(state),
        antallDagerIgjen: antalldagerIgjen
    };
};

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
    doVelgNavarendePeriode: () => dispatch(velgHistoriskPeriode(null)),
    doHentOppfolging: () => dispatch(hentOppfolging())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Varslinger);
