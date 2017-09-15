import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Bilde } from 'nav-react-design';
import { Hovedknapp } from 'nav-frontend-knapper';
import { storeForbokstaver, formaterDato } from '../../utils';
import * as AppPT from '../../proptypes';
import Modal from '../../felles-komponenter/modal/modal';
import PrintHeader from '../../felles-komponenter/modal/print-header';
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
    skalVisePrintMeldingForm,
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

function Print({ grupper, bruker, printMelding, mittMal, erVeileder }) {
    return (
        <div className="print-modal-body">
            <Bilde className="nav-logo-print" src={logoPng} alt="Logo NAV" />
            <div className="adresse-dato">
                <div className="adresse">
                    {storeForbokstaver(bruker.sammensattNavn)}
                    <HiddenIfDiv hidden={!erVeileder}>
                        {storeForbokstaver(
                            bruker.bostedsadresse.strukturertAdresse.Gateadresse
                                .gatenavn
                        )}&nbsp;
                        {
                            bruker.bostedsadresse.strukturertAdresse.Gateadresse
                                .husnummer
                        }
                        {
                            bruker.bostedsadresse.strukturertAdresse.Gateadresse
                                .husbokstav
                        },<br />
                        {
                            bruker.bostedsadresse.strukturertAdresse.Gateadresse
                                .postnummer
                        }&nbsp;
                        {storeForbokstaver(
                            bruker.bostedsadresse.strukturertAdresse.Gateadresse
                                .poststed
                        )}
                        <br />
                        {bruker.fodselsnummer}
                    </HiddenIfDiv>
                </div>
                <div className="dato">
                    <HiddenIfDiv hidden={!erVeileder}>
                        {bruker.behandlendeEnhet.navn}
                    </HiddenIfDiv>
                    Dato: {formaterDato(Date.now())}
                </div>
            </div>
            <h1 className="typo-systemtittel utskrift-overskrift">
                Aktivitetsplan
            </h1>
            <HiddenIfSection hidden={!printMelding} className="visprintmelding">
                <h1 className="typo-undertittel">
                    {printMelding.overskrift}
                </h1>
                <p>
                    {printMelding.beskrivelse}
                </p>
            </HiddenIfSection>
            <HiddenIfSection hidden={!mittMal} className="vismittmal">
                <h1 className="typo-undertittel">
                    <FormattedMessage id="aktivitetsmal.mitt-mal" />
                </h1>
                <p>
                    {mittMal && mittMal.mal}
                </p>
            </HiddenIfSection>
            {grupper}
        </div>
    );
}

Print.propTypes = {
    grupper: PT.arrayOf(StatusGruppe),
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
            fortsettRedigerPrintMelding,
            bruker,
            mittMal,
            erVeileder,
        } = this.props;
        const grupper = sorterteStatusGrupper.map(gruppe =>
            <StatusGruppe gruppe={gruppe} key={gruppe.status} />
        );

        const header = (
            <Innholdslaster avhengigheter={avhengigheter}>
                <PrintHeader>
                    <HiddenIfDiv
                        hidden={visPrintMeldingForm}
                        className="print-header"
                    >
                        <a
                            className="tilbakeknapp"
                            onClick={fortsettRedigerPrintMelding}
                            role="link"
                            tabIndex="0"
                        >
                            <div className="tilbakeknapp-innhold">
                                <i className="nav-frontend-chevron chevronboks chevron--venstre" />
                                <FormattedMessage
                                    id="print.modal.tilbake"
                                    className="tilbakeknapp-innhold__tekst"
                                />
                            </div>
                        </a>
                        <Hovedknapp
                            mini
                            className="print-knapp"
                            onClick={() => window.print()}
                        >
                            Skriv ut
                        </Hovedknapp>
                    </HiddenIfDiv>
                </PrintHeader>
            </Innholdslaster>
        );

        const innhold = visPrintMeldingForm
            ? <PrintMelding />
            : <Print
                  grupper={grupper}
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
    avhengigheter: PT.arrayOf(),
    printMelding: AppPT.printMelding,
    grupper: PT.arrayOf(StatusGruppe),
    bruker: AppPT.motpart.isRequired,
    visPrintMeldingForm: PT.bool.isRequired,
    fortsettRedigerPrintMelding: PT.func.isRequired,
    aktiviteter: AppPT.aktiviteter.isRequired,
    sorterteStatusGrupper: AppPT.aktiviteter,
    doHentMal: AppPT.mal.isRequired,
    doHentMalListe: PT.arrayOf(AppPT.mal).isRequired,
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
        visPrintMeldingForm: skalVisePrintMeldingForm(state),
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
