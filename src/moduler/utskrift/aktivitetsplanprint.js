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
import { selectAktivitetListe } from '../aktivitet/aktivitetliste-selector';
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
import { selectBruker } from '../bruker/bruker-selector';
import {
    hentPrintMelding,
    selectKanHaPrintMeldingForm,
    selectSkalVisePrintMeldingForm,
} from './utskrift-selector';
import { redigerPrintMelding } from './utskrift-duck';
import { selectGjeldendeMal, selectMalStatus } from '../mal/mal-selector';
import {
    section as HiddenIfSection,
    div as HiddenIfDiv,
} from '../../felles-komponenter/hidden-if/hidden-if';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { hentMal, hentMalListe } from '../mal/mal-reducer';
import { selectSituasjonStatus } from '../situasjon/situasjon-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';

const StatusGruppePT = PT.shape({
    status: PT.string.isRequired,
    aktiviteter: AppPT.aktiviteter,
});

function Print({ grupper, bruker, printMelding, mittMal, erVeileder }) {
    const { fodselsnummer, fornavn, etternavn, bostedsadresse } = bruker;
    const gateadresse = bostedsadresse.strukturertAdresse.Gateadresse;
    const {
        gatenavn,
        poststed,
        husbokstav,
        husnummer,
        postnummer,
    } = gateadresse;
    const { overskrift, beskrivelse } = printMelding;

    const statusGrupper = grupper.map(gruppe =>
        <StatusGruppe gruppe={gruppe} key={gruppe.status} />
    );

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
                        <StoreForbokstaver tag="div">
                            {`${gatenavn} ${husnummer} ${husbokstav || ''}`}
                        </StoreForbokstaver>
                        <StoreForbokstaver tag="div">{`${postnummer} ${poststed}`}</StoreForbokstaver>
                        <div>
                            {fodselsnummer}
                        </div>
                    </HiddenIfDiv>
                </div>
                <div className="printmodal-body__dato">
                    <HiddenIfDiv hidden={!erVeileder}>
                        {bruker.behandlendeEnhet.navn}
                    </HiddenIfDiv>
                    Dato: {formaterDato(Date.now())}
                </div>
            </div>
            <Systemtittel
                tag="h1"
                className="printmodal-body__utskrift-overskrift"
            >
                <FormattedMessage id="hovedside.tittel" />
            </Systemtittel>
            <HiddenIfSection
                hidden={!printMelding}
                className="printmodal-body__visprintmelding"
            >
                <Undertittel
                    tag="h1"
                    className="printmodal-body__visprintmelding-overskrift"
                >
                    {overskrift}
                </Undertittel>
                <p>
                    {beskrivelse}
                </p>
            </HiddenIfSection>
            <HiddenIfSection
                hidden={!mittMal.mal}
                className="printmodal-body__vismittmal"
            >
                <Undertittel
                    tag="h1"
                    className="printmodal-body__vismittmal-overskrift"
                >
                    <FormattedMessage id="aktivitetsmal.mitt-mal" />
                </Undertittel>
                <p>
                    {mittMal && mittMal.mal}
                </p>
            </HiddenIfSection>
            {statusGrupper}
        </div>
    );
}

Print.propTypes = {
    grupper: PT.arrayOf(StatusGruppePT),
    bruker: AppPT.motpart.isRequired,
    printMelding: AppPT.printMelding.isRequired,
    mittMal: AppPT.mal,
    erVeileder: PT.bool,
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
            fortsettRedigerPrintMelding,
            bruker,
            mittMal,
            erVeileder,
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
                            mini
                            className="printmodal-header__printknapp"
                            onClick={() => window.print()}
                        >
                            Skriv ut
                        </Hovedknapp>
                    </HiddenIfDiv>
                </header>
            </Innholdslaster>
        );

        const innhold = visPrintMeldingForm
            ? <PrintMelding />
            : <Print
                  grupper={sorterteStatusGrupper}
                  bruker={bruker}
                  printMelding={printMelding}
                  mittMal={mittMal}
                  erVeileder={erVeileder}
              />;

        return (
            <section>
                <Modal
                    contentLabel="aktivitetsplanPrint"
                    className="aktivitetsplanprint"
                    header={header}
                >
                    <Innholdslaster avhengigheter={avhengigheter}>
                        {innhold}
                    </Innholdslaster>
                </Modal>
            </section>
        );
    }
}

AktivitetsplanPrintModal.propTypes = {
    avhengigheter: PT.array,
    printMelding: AppPT.printMelding,
    grupper: PT.arrayOf(StatusGruppe),
    bruker: AppPT.motpart.isRequired,
    visPrintMeldingForm: PT.bool.isRequired,
    kanHaPrintMelding: PT.bool.isRequired,
    fortsettRedigerPrintMelding: PT.func.isRequired,
    aktiviteter: AppPT.aktiviteter.isRequired,
    sorterteStatusGrupper: PT.arrayOf(StatusGruppePT),
    doHentMal: PT.func.isRequired,
    doHentMalListe: PT.func.isRequired,
    mittMal: AppPT.mal,
    erVeileder: PT.bool.isRequired,
};

AktivitetsplanPrintModal.defaultProps = {
    avhengigheter: [],
    printMelding: undefined,
    grupper: undefined,
    sorterteStatusGrupper: undefined,
    mittMal: null,
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
        }));

    const bruker = selectBruker(state);
    const printMelding = hentPrintMelding(state);
    const mittMal = selectGjeldendeMal(state);
    const erVeileder = selectErVeileder(state);

    return {
        avhengigheter: [selectMalStatus(state), selectSituasjonStatus(state)],
        aktiviteter,
        sorterteStatusGrupper,
        visPrintMeldingForm: selectSkalVisePrintMeldingForm(state),
        kanHaPrintMelding: selectKanHaPrintMeldingForm(state),
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
