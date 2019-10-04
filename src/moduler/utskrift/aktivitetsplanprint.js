import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel, Systemtittel } from 'nav-frontend-typografi';
import { formaterDatoKortManed } from '../../utils';
import StoreForbokstaver from '../../felles-komponenter/utils/store-forbokstaver';
import * as AppPT from '../../proptypes';
import Modal from '../../felles-komponenter/modal/modal';
import { selectAktivitetListe, selectAktivitetListeStatus } from '../aktivitet/aktivitetliste-selector';
import logoPng from './logo.png';
import StatusGruppe from './statusgruppe';
import PrintMelding from './printmelding';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT
} from '../../constant';
import { selectBruker, selectBrukerStatus } from '../bruker/bruker-selector';
import {
    hentPrintMelding,
    selectCurrentStepUtskrift,
    selectKanHaPrintMeldingForm,
    selectKanVelgePlanType,
    selectUtskriftPlanType
} from './utskrift-selector';
import { goToStepUtskrift, resetUtskrift } from './utskrift-duck';
import { hentMal, selectGjeldendeMal, selectMalStatus } from '../mal/aktivitetsmal-reducer';
import { hentMalListe } from '../mal/malliste-reducer';
import { section as HiddenIfSection, div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import {
    selectErBrukerManuell,
    selectKvpPeriodeForValgteOppfolging,
    selectOppfolgingStatus
} from '../oppfolging-status/oppfolging-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import FnrProvider from '../../bootstrap/fnr-provider';
import { selectAlleDialoger, selectDialogStatus } from '../dialog/dialog-selector';
import DialogPrint from './dialog-print';
import VelgPlanUtskrift from './velg-plan-utskrift';
import loggEvent, { PRINT_MODSAL_OPEN, TRYK_PRINT } from '../../felles-komponenter/utils/logging';

const StatusGruppePT = PT.shape({
    status: PT.string.isRequired,
    aktiviteter: AppPT.aktiviteter,
    dialoger: PT.arrayOf(AppPT.dialog)
});

function Adresse({ bruker }) {
    const { bostedsadresse } = bruker;
    const strukturertAdresse = bostedsadresse && bostedsadresse.strukturertAdresse;
    const gateadresse = strukturertAdresse && strukturertAdresse.Gateadresse;
    if (!gateadresse) {
        return <div />;
    }
    const { gatenavn, poststed, husbokstav, husnummer, postnummer } = gateadresse;
    return (
        <div>
            <StoreForbokstaver tag="div">{`${gatenavn} ${husnummer} ${husbokstav || ''}`}</StoreForbokstaver>
            <StoreForbokstaver tag="div">{`${postnummer} ${poststed}`}</StoreForbokstaver>
        </div>
    );
}

Adresse.propTypes = {
    bruker: AppPT.bruker.isRequired
};

function Print({
    grupper,
    bruker,
    printMelding,
    mittMal,
    erVeileder,
    dialoger,
    utskriftPlanType,
    valgtKvpPeriode,
    erManuell
}) {
    const { fodselsnummer, fornavn, etternavn } = bruker;
    const { beskrivelse } = printMelding;

    const statusGrupper = grupper.map(gruppe => <StatusGruppe gruppe={gruppe} key={gruppe.status} />);

    const { behandlendeEnhet } = bruker;
    const enhetsNavn = behandlendeEnhet && behandlendeEnhet.navn;

    const erKvpUtskrift =
        utskriftPlanType !== undefined && utskriftPlanType !== 'helePlanen' && utskriftPlanType !== 'aktivitetsplan';

    let dialogerUtenAktivitet;
    let filtrerteDialoger;
    let kvpPeriodeFra;
    let kvpPeriodeTil;
    if (erKvpUtskrift) {
        dialogerUtenAktivitet = dialoger && dialoger.filter(d => d.aktivitetId === null);
        filtrerteDialoger =
            dialogerUtenAktivitet &&
            dialogerUtenAktivitet.filter(
                d => d.sisteDato >= valgtKvpPeriode.opprettetDato && d.sisteDato <= valgtKvpPeriode.avsluttetDato
            );
        kvpPeriodeFra = formaterDatoKortManed(valgtKvpPeriode.opprettetDato);
        kvpPeriodeTil = formaterDatoKortManed(valgtKvpPeriode.avsluttetDato);
    }

    return (
        <div className="printmodal-body">
            <img className="printmodal-body__nav-logo-print" src={logoPng} alt="Logo NAV" />
            <div className="printmodal-body__adresse-dato">
                <div className="printmodal-body__adresse">
                    <HiddenIfDiv hidden={!erVeileder}>
                        <StoreForbokstaver>{`${fornavn} ${etternavn}`}</StoreForbokstaver>
                        <Adresse bruker={bruker} />
                    </HiddenIfDiv>
                </div>
                <div className="printmodal-body__dato">
                    <HiddenIfDiv hidden={!erVeileder}>{enhetsNavn}</HiddenIfDiv>
                    Dato
                    {` ${formaterDatoKortManed(Date.now())}`}
                    <HiddenIfDiv hidden={!fodselsnummer}>{`Fødselsnummer: ${fodselsnummer}`}</HiddenIfDiv>
                    <HiddenIfDiv hidden={!erKvpUtskrift}>Modia Arbeidsrettet Oppfølging</HiddenIfDiv>
                    <HiddenIfDiv hidden={!erKvpUtskrift}>{`Periode: ${kvpPeriodeFra} - ${kvpPeriodeTil}`}</HiddenIfDiv>
                    <HiddenIfDiv hidden={!erKvpUtskrift}>
                        {erManuell ? 'Manuell bruker' : 'Pålogget nivå 4'}
                    </HiddenIfDiv>
                </div>
            </div>
            <Systemtittel tag="h1" className="printmodal-body__utskrift--overskrift">
                Aktivitetsplan
            </Systemtittel>
            <HiddenIfSection hidden={!printMelding} className="printmodal-body__visprintmelding">
                <p>{beskrivelse}</p>
            </HiddenIfSection>
            <HiddenIfSection hidden={!mittMal || !mittMal.mal} className="printmodal-body__vismittmal">
                <Undertittel tag="h1" className="printmodal-body__vismittmal--overskrift">
                    Mitt mål
                </Undertittel>
                <p>{mittMal && mittMal.mal}</p>
            </HiddenIfSection>
            {statusGrupper}
            <HiddenIfSection hidden={!erKvpUtskrift || !filtrerteDialoger} className="printmodal-body__statusgrupper">
                {filtrerteDialoger && filtrerteDialoger.map(d => <DialogPrint key={d.dialogId} dialog={d} />)}
            </HiddenIfSection>
        </div>
    );
}

Print.propTypes = {
    grupper: PT.arrayOf(StatusGruppePT),
    bruker: AppPT.bruker.isRequired,
    printMelding: AppPT.printMelding.isRequired,
    mittMal: AppPT.mal,
    erVeileder: PT.bool,
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    utskriftPlanType: PT.string,
    valgtKvpPeriode: PT.object,
    erManuell: PT.bool
};

Print.defaultProps = {
    grupper: [],
    mittMal: null,
    erVeileder: false,
    utskriftPlanType: 'helePlanen',
    valgtKvpPeriode: undefined,
    erManuell: false
};

const STEP_VELG_PLAN = 'VELG_PLAN';
const STEP_MELDING_FORM = 'MELDING_FORM';
const STEP_UTSKRIFT = 'UTSKRIFT';

class AktivitetsplanPrintModal extends Component {
    componentDidMount() {
        const { doHentMal, doHentMalListe } = this.props;

        doHentMal();
        doHentMalListe();
        loggEvent(PRINT_MODSAL_OPEN);
    }

    render() {
        const { avhengigheter, stepOrder, steps, currentStep, goToStep, doResetUtskrift } = this.props;

        const currentStepIndex = stepOrder.indexOf(currentStep);

        const header = (
            <Innholdslaster avhengigheter={avhengigheter}>
                <header className="modal-header">
                    <div className="printmodal-header">
                        <Knappelenke
                            className="tilbakeknapp printmodal-header__tilbakeknapp"
                            onClick={() => goToStep(currentStepIndex - 1)}
                            role="link"
                            tabIndex="0"
                            hidden={currentStepIndex === 0}
                        >
                            <div className="tilbakeknapp-innhold">
                                <i className="nav-frontend-chevron chevronboks chevron--venstre" />
                                <div className="tilbakeknapp-innhold__tekst">Tilbake</div>
                            </div>
                        </Knappelenke>
                        <HiddenIfHovedknapp
                            hidden={currentStep !== STEP_UTSKRIFT}
                            className="printmodal-header__printknapp"
                            onClick={() => {
                                window.print();
                                loggEvent(TRYK_PRINT);
                            }}
                        >
                            Skriv ut
                        </HiddenIfHovedknapp>
                    </div>
                </header>
            </Innholdslaster>
        );

        return (
            <section>
                <FnrProvider>
                    <Modal
                        contentLabel="aktivitetsplanPrint"
                        className="aktivitetsplanprint"
                        header={header}
                        onRequestClose={doResetUtskrift}
                    >
                        <Innholdslaster avhengigheter={avhengigheter}>{steps[currentStep]}</Innholdslaster>
                    </Modal>
                </FnrProvider>
            </section>
        );
    }
}

AktivitetsplanPrintModal.propTypes = {
    avhengigheter: PT.array,
    doHentMal: PT.func.isRequired,
    doHentMalListe: PT.func.isRequired,
    stepOrder: PT.arrayOf(PT.string).isRequired,
    steps: PT.object.isRequired,
    currentStep: PT.string.isRequired,
    goToStep: PT.func.isRequired,
    doResetUtskrift: PT.func.isRequired,
    erVeileder: PT.bool,
    history: AppPT.history.isRequired
};

AktivitetsplanPrintModal.defaultProps = {
    avhengigheter: [],
    erVeileder: null
};

const statusRekkefolge = [
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT
];

const mapStateToProps = state => {
    let aktiviteter;

    const utskriftPlanType = selectUtskriftPlanType(state);
    const kvpPerioder = selectKvpPeriodeForValgteOppfolging(state);
    const valgtKvpPeriode = kvpPerioder && kvpPerioder.find(periode => periode.opprettetDato === utskriftPlanType);
    const valgtKvpPeriodeId = (valgtKvpPeriode && valgtKvpPeriode.opprettetDato) || '';

    switch (utskriftPlanType) {
        case 'helePlanen':
            aktiviteter = selectAktivitetListe(state);
            break;
        case 'aktivitetsplan':
            aktiviteter = selectAktivitetListe(state).filter(a =>
                kvpPerioder.every(kvp => a.opprettetDato < kvp.opprettetDato || a.opprettetDato > kvp.avsluttetDato)
            );
            break;
        case valgtKvpPeriodeId:
            aktiviteter = selectAktivitetListe(state).filter(
                a =>
                    a.opprettetDato >= valgtKvpPeriode.opprettetDato && a.opprettetDato <= valgtKvpPeriode.avsluttetDato
            );
            break;
        default:
            aktiviteter = selectAktivitetListe(state);
    }

    const dialoger = selectAlleDialoger(state);

    const statusTilAktiviteter = aktiviteter.reduce((memo, aktivitet) => {
        const { status } = aktivitet;
        const nesteMemo = memo;
        if (nesteMemo[status]) {
            nesteMemo[status].push(aktivitet);
        } else {
            nesteMemo[status] = [aktivitet];
        }
        return nesteMemo;
    }, {});

    const skjulDialoger =
        utskriftPlanType === undefined || utskriftPlanType === 'helePlanen' || utskriftPlanType === 'aktivitetsplan';

    const sorterteStatusGrupper = Object.keys(statusTilAktiviteter)
        .sort((a, b) => statusRekkefolge.indexOf(a) - statusRekkefolge.indexOf(b))
        .map(status => ({
            status,
            aktiviteter: statusTilAktiviteter[status],
            dialoger: skjulDialoger ? [] : dialoger
        }));

    const bruker = selectBruker(state);
    const printMelding = hentPrintMelding(state);
    const mittMal = selectGjeldendeMal(state);
    const erVeileder = selectErVeileder(state);
    const erManuell = selectErBrukerManuell(state);

    const print = (
        <Print
            grupper={sorterteStatusGrupper}
            dialoger={dialoger}
            bruker={bruker}
            printMelding={printMelding}
            mittMal={mittMal}
            erVeileder={erVeileder}
            utskriftPlanType={utskriftPlanType}
            valgtKvpPeriode={valgtKvpPeriode}
            erManuell={erManuell}
        />
    );
    const meldingForm = <PrintMelding />;
    const printValg = <VelgPlanUtskrift />;

    const kanHaPrintValg = selectKanVelgePlanType(state);
    const kanHaPrintMelding = selectKanHaPrintMeldingForm(state);

    const stepOrder = [];
    const steps = {};

    if (kanHaPrintValg) {
        stepOrder.push(STEP_VELG_PLAN);
        steps[STEP_VELG_PLAN] = printValg;
    }
    if (kanHaPrintMelding) {
        stepOrder.push(STEP_MELDING_FORM);
        steps[STEP_MELDING_FORM] = meldingForm;
    }
    stepOrder.push(STEP_UTSKRIFT);
    steps[STEP_UTSKRIFT] = print;
    const currentStep = stepOrder[selectCurrentStepUtskrift(state)];

    return {
        avhengigheter: [
            selectMalStatus(state),
            selectOppfolgingStatus(state),
            selectAktivitetListeStatus(state),
            selectBrukerStatus(state),
            selectDialogStatus(state)
        ],
        stepOrder,
        steps,
        currentStep,
        erVeileder
    };
};

function mapDispatchToProps(dispatch, props) {
    return {
        goToStep: step => dispatch(goToStepUtskrift(step)),
        doResetUtskrift: () => {
            dispatch(resetUtskrift());
            props.history.push('/');
        },
        doHentMal: () => dispatch(hentMal()),
        doHentMalListe: () => dispatch(hentMalListe())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AktivitetsplanPrintModal);
