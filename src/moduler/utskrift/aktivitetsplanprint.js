import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Undertittel, Systemtittel } from 'nav-frontend-typografi';
import Bilde from '../../felles-komponenter/bilde/bilde';
import { formaterDato } from '../../utils';
import StoreForbokstaver from '../../felles-komponenter/utils/store-forbokstaver';
import * as AppPT from '../../proptypes';
import Modal from '../../felles-komponenter/modal/modal';
import {
    selectAktivitetListe,
    selectAktivitetListeStatus,
} from '../aktivitet/aktivitetliste-selector';
import logoPng from './logo.png';
import StatusGruppe from './statusgruppe';
import PrintMelding from './printmelding';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../constant';
import { selectBruker, selectBrukerStatus } from '../bruker/bruker-selector';
import {
    hentPrintMelding,
    selectKanHaPrintMeldingForm,
    selectSkalVisePrintMeldingForm,
    selectSkalViseVelgPrintType,
} from './utskrift-selector';
import { redigerPrintMelding } from './utskrift-duck';
import {
    hentMal,
    selectGjeldendeMal,
    selectMalStatus,
} from '../mal/aktivitetsmal-reducer';
import { hentMalListe } from '../mal/malliste-reducer';
import {
    section as HiddenIfSection,
    div as HiddenIfDiv,
} from '../../felles-komponenter/hidden-if/hidden-if';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import FnrProvider from './../../bootstrap/fnr-provider';
import {
    selectAlleDialoger,
    selectDialogStatus,
} from '../dialog/dialog-selector';
import DialogPrint from './dialog-print';
import KvpUtskrift from './kvp-utskrift';

const StatusGruppePT = PT.shape({
    status: PT.string.isRequired,
    aktiviteter: AppPT.aktiviteter,
    dialoger: PT.arrayOf(AppPT.dialog),
});

function Adresse({ bruker }) {
    const { bostedsadresse } = bruker;
    const strukturertAdresse =
        bostedsadresse && bostedsadresse.strukturertAdresse;
    const gateadresse = strukturertAdresse && strukturertAdresse.Gateadresse;
    if (!gateadresse) {
        return <div />;
    }
    const {
        gatenavn,
        poststed,
        husbokstav,
        husnummer,
        postnummer,
    } = gateadresse;
    return (
        <div>
            <StoreForbokstaver tag="div">
                {`${gatenavn} ${husnummer} ${husbokstav || ''}`}
            </StoreForbokstaver>
            <StoreForbokstaver tag="div">{`${postnummer} ${poststed}`}</StoreForbokstaver>
        </div>
    );
}

Adresse.propTypes = {
    bruker: AppPT.bruker.isRequired,
};

function Print({
    grupper,
    bruker,
    printMelding,
    mittMal,
    erVeileder,
    dialoger,
}) {
    const { fodselsnummer, fornavn, etternavn } = bruker;
    const { beskrivelse } = printMelding;

    const statusGrupper = grupper.map(gruppe =>
        <StatusGruppe gruppe={gruppe} key={gruppe.status} />
    );

    const behandlendeEnhet = bruker.behandlendeEnhet;
    const enhetsNavn = behandlendeEnhet && behandlendeEnhet.navn;

    const dialogerUtenAktivitet = dialoger.filter(d => d.aktivitetId === null);

    return (
        <div className="printmodal-body">
            <Bilde
                className="printmodal-body__nav-logo-print"
                src={logoPng}
                alt="Logo NAV"
            />
            <div className="printmodal-body__adresse-dato">
                <div className="printmodal-body__adresse">
                    <HiddenIfDiv hidden={!erVeileder}>
                        <StoreForbokstaver>
                            {`${fornavn} ${etternavn}`}
                        </StoreForbokstaver>
                        <Adresse bruker={bruker} />
                    </HiddenIfDiv>
                </div>
                <div className="printmodal-body__dato">
                    <HiddenIfDiv hidden={!erVeileder}>
                        {enhetsNavn}
                    </HiddenIfDiv>
                    <FormattedMessage id="print.modal.utskrift.dato" />
                    {` ${formaterDato(Date.now())}`}
                    <HiddenIfDiv hidden={!fodselsnummer}>
                        <FormattedMessage id="print.modal.utskrift.fnr" />
                        {` ${fodselsnummer}`}
                    </HiddenIfDiv>
                </div>
            </div>
            <Systemtittel
                tag="h1"
                className="printmodal-body__utskrift--overskrift"
            >
                <FormattedMessage id="hovedside.tittel" />
            </Systemtittel>
            <HiddenIfSection
                hidden={!printMelding}
                className="printmodal-body__visprintmelding"
            >
                <p>
                    {beskrivelse}
                </p>
            </HiddenIfSection>
            <HiddenIfSection
                hidden={!mittMal || !mittMal.mal}
                className="printmodal-body__vismittmal"
            >
                <Undertittel
                    tag="h1"
                    className="printmodal-body__vismittmal--overskrift"
                >
                    <FormattedMessage id="aktivitetsmal.mitt-mal" />
                </Undertittel>
                <p>
                    {mittMal && mittMal.mal}
                </p>
            </HiddenIfSection>
            {statusGrupper}
            <section className="printmodal-body__statusgrupper">
                {dialogerUtenAktivitet &&
                    dialogerUtenAktivitet.map(d =>
                        <DialogPrint key={d.dialogId} dialog={d} />
                    )}
            </section>
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
};

Print.defaultProps = {
    grupper: [],
    mittMal: null,
    erVeileder: false,
};

class AktivitetsplanPrintModal extends Component {
    componentDidMount() {
        this.props.doHentMal();
        this.props.doHentMalListe();
    }

    render() {
        const {
            avhengigheter,
            printMelding,
            sorterteStatusGrupper,
            visPrintMeldingForm,
            kanHaPrintMelding,
            visVelgPrintType,
            fortsettRedigerPrintMelding,
            bruker,
            mittMal,
            erVeileder,
            dialoger,
        } = this.props;

        const header = (
            <Innholdslaster avhengigheter={avhengigheter}>
                <header className="modal-header">
                    <HiddenIfDiv
                        hidden={visPrintMeldingForm}
                        className="printmodal-header"
                    >
                        <Knappelenke
                            className="tilbakeknapp printmodal-header__tilbakeknapp"
                            onClick={fortsettRedigerPrintMelding}
                            role="link"
                            tabIndex="0"
                            hidden={!kanHaPrintMelding}
                        >
                            <div className="tilbakeknapp-innhold">
                                <i className="nav-frontend-chevron chevronboks chevron--venstre" />
                                <FormattedMessage
                                    id="print.modal.tilbake"
                                    className="tilbakeknapp-innhold__tekst"
                                />
                            </div>
                        </Knappelenke>
                        <Hovedknapp
                            className="printmodal-header__printknapp"
                            onClick={() => window.print()}
                        >
                            Skriv ut
                        </Hovedknapp>
                    </HiddenIfDiv>
                </header>
            </Innholdslaster>
        );

        const meldingForm = visPrintMeldingForm
            ? <PrintMelding />
            : <Print
                  grupper={sorterteStatusGrupper}
                  dialoger={dialoger}
                  bruker={bruker}
                  printMelding={printMelding}
                  mittMal={mittMal}
                  erVeileder={erVeileder}
              />;

        const innhold = visVelgPrintType ? <KvpUtskrift /> : meldingForm;

        return (
            <section>
                <FnrProvider>
                    <Modal
                        contentLabel="aktivitetsplanPrint"
                        className="aktivitetsplanprint"
                        header={header}
                    >
                        <Innholdslaster avhengigheter={avhengigheter}>
                            {innhold}
                        </Innholdslaster>
                    </Modal>
                </FnrProvider>
            </section>
        );
    }
}

AktivitetsplanPrintModal.propTypes = {
    avhengigheter: PT.array,
    printMelding: AppPT.printMelding,
    grupper: PT.arrayOf(StatusGruppe),
    bruker: AppPT.motpart.isRequired,
    visPrintMeldingForm: PT.bool,
    kanHaPrintMelding: PT.bool,
    visVelgPrintType: PT.bool,
    fortsettRedigerPrintMelding: PT.func.isRequired,
    aktiviteter: AppPT.aktiviteter.isRequired,
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    sorterteStatusGrupper: PT.arrayOf(StatusGruppePT),
    doHentMal: PT.func.isRequired,
    doHentMalListe: PT.func.isRequired,
    mittMal: AppPT.mal,
    erVeileder: PT.bool,
};

AktivitetsplanPrintModal.defaultProps = {
    avhengigheter: [],
    printMelding: undefined,
    grupper: undefined,
    visPrintMeldingForm: undefined,
    kanHaPrintMelding: undefined,
    visVelgPrintType: undefined,
    sorterteStatusGrupper: undefined,
    mittMal: null,
    erVeileder: undefined,
};

const statusRekkefolge = [
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
];

const mapStateToProps = state => {
    const aktiviteter = selectAktivitetListe(state);

    const dialoger = selectAlleDialoger(state);

    const statusTilAktiviteter = aktiviteter.reduce((memo, aktivitet) => {
        const status = aktivitet.status;
        const nesteMemo = memo;
        if (nesteMemo[status]) {
            nesteMemo[status].push(aktivitet);
        } else {
            nesteMemo[status] = [aktivitet];
        }
        return nesteMemo;
    }, {});

    const sorterteStatusGrupper = Object.keys(statusTilAktiviteter)
        .sort(
            (a, b) => statusRekkefolge.indexOf(a) - statusRekkefolge.indexOf(b)
        )
        .map(status => ({
            status,
            aktiviteter: statusTilAktiviteter[status],
            dialoger,
        }));

    const bruker = selectBruker(state);
    const printMelding = hentPrintMelding(state);
    const mittMal = selectGjeldendeMal(state);
    const erVeileder = selectErVeileder(state);

    return {
        avhengigheter: [
            selectMalStatus(state),
            selectOppfolgingStatus(state),
            selectAktivitetListeStatus(state),
            selectBrukerStatus(state),
            selectDialogStatus(state),
        ],
        aktiviteter,
        dialoger,
        sorterteStatusGrupper,
        visPrintMeldingForm: selectSkalVisePrintMeldingForm(state),
        kanHaPrintMelding: selectKanHaPrintMeldingForm(state),
        visVelgPrintType: selectSkalViseVelgPrintType(state),
        bruker,
        printMelding,
        mittMal,
        erVeileder,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fortsettRedigerPrintMelding: () => dispatch(redigerPrintMelding()),
        doHentMal: () => dispatch(hentMal()),
        doHentMalListe: () => dispatch(hentMalListe()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(
    AktivitetsplanPrintModal
);
