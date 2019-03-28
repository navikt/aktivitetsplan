import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import { moment } from '../../utils';
import { hentIdentitet } from '../identitet/identitet-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';
import {
    HiddenIfVarsling,
    HiddenIfVarslingMedLenke,
    HiddenIfAdvarselMedLenke,
} from './varsel-alertstriper';
import {
    selectErUnderOppfolging,
    selectErBrukerManuell,
    selectReservasjonKRR,
    selectTilHorendeDialogId,
    selectErEskalert,
    selectOppfolgingStatus,
    selectErUnderKvp,
    selectInaktiveringsDato,
    selectKanReaktiveres,
} from '../oppfolging-status/oppfolging-selector';
import {
    selectErBruker,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';
import {
    selectErBrukerAktivIArena,
    selectOppfoelgingsstatusStatus,
} from '../oppfoelgingsstatus/oppfoelgingsstatus-selector';
import { velgHistoriskPeriode } from '../filtrering/filter/filter-reducer';
import { SLETT_BEGRUNNELSE_ACTION } from '../innstillinger/innstillinger-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { hentOppfolgingsstatus } from '../oppfoelgingsstatus/oppfoelgingsstatus-reducer';
import { hentOppfolging } from '../oppfolging-status/oppfolging-reducer';
import { arbeidssokerregistreringHref } from '../oppfolging-status/har-ikke-aktivitetsplan';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';
import {
    FLYTT_ALERTSTRIPER_INSIDEN,
    harFeature,
} from '../../felles-komponenter/feature/feature';

class Varslinger extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
        if (!this.props.erBruker) {
            this.props.doHentOppfolgingsstatus(getFodselsnummer());
        } else {
            this.props.doHentOppfolging();
        }
    }

    hentInfotekstTilInaktivertBrukere() {
        const antalldagerIgjen = this.props.antallDagerIgjen;
        const antallDagerIgjenMerEnn10 =
            antalldagerIgjen <= 28 && antalldagerIgjen >= 10;
        const antallDagerIgjenMindreEnn10 =
            antalldagerIgjen < 10 && antalldagerIgjen >= 1;

        if (antallDagerIgjenMerEnn10) {
            return 'oppfolging.inaktivert-28-til-10-dager.reaktiveres';
        } else if (antallDagerIgjenMindreEnn10) {
            return 'oppfolging.inaktivert-mindre-enn-10-dager.reaktiveres';
        }
        return 'oppfolging.inaktivert-mer-enn-28-dager.reaktiveres';
    }

    render() {
        const {
            erBruker,
            avhengigheter,
            innsideAvhengigheter,
            underOppfolging,
            brukerErAktivIArena,
            brukerErManuell,
            reservertIKRR,
            brukerErEskalert,
            tilhorendeDialogId,
            doVelgNavarendePeriode,
            slettBegrunnelse,
            erUnderKvp,
            kanReaktiveres,
            antallDagerIgjen,
            harFlyttAlertStriperTilVisittKortFt,
        } = this.props;

        const reaktiveringsInfoTekst = this.hentInfotekstTilInaktivertBrukere();

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
                <HiddenIfAdvarselMedLenke
                    hidden={!kanReaktiveres}
                    tekstId={reaktiveringsInfoTekst}
                    className="varsling"
                    lenkeTekstId="oppfolging.ikke-under-oppfolging.reaktiveres.lenke-tekst"
                    href={arbeidssokerregistreringHref}
                    erEksternLenke
                    values={{ antalldagerIgjen: antallDagerIgjen }}
                />
                <HiddenIfAdvarselMedLenke
                    hidden={underOppfolging}
                    tekstId={'ikke.under.oppfolging.reaktivering'}
                    className="varsling"
                    lenkeTekstId="ikke.under.oppfolging.reaktivering.lenke"
                    href={arbeidssokerregistreringHref}
                    erEksternLenke
                    values={{ antalldagerIgjen: antallDagerIgjen }}
                />
            </Container>
        );

        const visVarslingerForVeileder =
            !harFlyttAlertStriperTilVisittKortFt &&
            <Container>
                <HiddenIfVarsling
                    hidden={underOppfolging}
                    tekstId="oppfolging.ikke-under-oppfolging"
                    className="varsling"
                />
                <HiddenIfVarsling
                    hidden={!erUnderKvp}
                    tekstId="oppfolging.veileder.under-kvp-oppfolging.varsel"
                    className="varsling"
                />
                <HiddenIfVarsling
                    hidden={!reservertIKRR}
                    tekstId="oppfolging.bruker-reservert-i-krr"
                    className="varsling"
                />
                <HiddenIfVarsling
                    hidden={brukerErAktivIArena}
                    tekstId="oppfolging.bruker-iserv"
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
                    onClick={() => slettBegrunnelse()}
                />
            </Container>;

        const soneAvhengigheter = erBruker
            ? avhengigheter
            : avhengigheter.concat(innsideAvhengigheter);
        return (
            <Innholdslaster avhengigheter={soneAvhengigheter}>
                {erBruker ? visVarslingerForBruker : visVarslingerForVeileder}
            </Innholdslaster>
        );
    }
}

Varslinger.defaultProps = {
    erBruker: false,
    underOppfolging: false,
    brukerErAktivIArena: false,
    brukerErManuell: false,
    reservertIKRR: false,
    brukerErEskalert: false,
    historiskVisning: false,
    tilhorendeDialogId: undefined,
    erUnderKvp: false,
    kanReaktiveres: false,
    antallDagerIgjen: undefined,
    harFlyttAlertStriperTilVisittKortFt: false,
};

Varslinger.propTypes = {
    erBruker: PT.bool,
    avhengigheter: AppPT.avhengigheter.isRequired,
    innsideAvhengigheter: AppPT.avhengigheter.isRequired,
    underOppfolging: PT.bool,
    brukerErAktivIArena: PT.bool,
    brukerErManuell: PT.bool,
    reservertIKRR: PT.bool,
    doHentIdentitet: PT.func.isRequired,
    doVelgNavarendePeriode: PT.func.isRequired,
    doHentOppfolgingsstatus: PT.func.isRequired,
    slettBegrunnelse: PT.func.isRequired,
    brukerErEskalert: PT.bool,
    tilhorendeDialogId: PT.number,
    erUnderKvp: PT.bool,
    doHentOppfolging: PT.func.isRequired,
    kanReaktiveres: PT.bool,
    antallDagerIgjen: PT.number,
    harFlyttAlertStriperTilVisittKortFt: PT.bool,
};

const mapStateToProps = state => {
    const dagensDato = moment();
    const inaktiveringsdato = selectInaktiveringsDato(state);
    const dato28dagerEtterIserv = moment(inaktiveringsdato).add(28, 'day');
    const antalldagerIgjen = dato28dagerEtterIserv.diff(dagensDato, 'days');
    const features = selectFeatureData(state);
    return {
        erBruker: selectErBruker(state),
        avhengigheter: [
            selectOppfolgingStatus(state),
            selectIdentitetStatus(state),
        ],
        innsideAvhengigheter: [selectOppfoelgingsstatusStatus(state)],
        brukerErAktivIArena: selectErBrukerAktivIArena(state),
        underOppfolging: selectErUnderOppfolging(state),
        brukerErManuell: selectErBrukerManuell(state),
        reservertIKRR: selectReservasjonKRR(state),
        brukerErEskalert: selectErEskalert(state),
        tilhorendeDialogId: selectTilHorendeDialogId(state),
        erUnderKvp: selectErUnderKvp(state),
        kanReaktiveres: selectKanReaktiveres(state),
        antallDagerIgjen: antalldagerIgjen,
        harFlyttAlertStriperTilVisittKortFt: harFeature(
            FLYTT_ALERTSTRIPER_INSIDEN,
            features
        ),
    };
};

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
    doVelgNavarendePeriode: () => dispatch(velgHistoriskPeriode(null)),
    doHentOppfolgingsstatus: fnr => dispatch(hentOppfolgingsstatus(fnr)),
    doHentOppfolging: () => dispatch(hentOppfolging()),
    slettBegrunnelse: () => dispatch(SLETT_BEGRUNNELSE_ACTION),
});

export default connect(mapStateToProps, mapDispatchToProps)(Varslinger);
