import React from 'react';
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

function Print({ grupper, bruker, printMelding }) {
    return (
        <div className="print-modal-body">
            <Bilde className="nav-logo-print" src={logoPng} alt="Logo NAV" />
            <div className="adresse-dato">
                <div className="adresse">
                    {storeForbokstaver(bruker.sammensattNavn)}
                </div>
                <div className="dato">
                    Dato: {formaterDato(Date.now())}
                </div>
            </div>
            <h1 className="typo-systemtittel">Aktivitetsplan</h1>
            <section className="visprintmelding">
                <h1>
                    {printMelding.overskrift}
                </h1>
                <p>
                    {printMelding.beskrivelse}
                </p>
            </section>
            <section className="vismittmal">
                <h2>Mitt Mål</h2>
                <div>......</div>
            </section>
            {grupper}
        </div>
    );
}

Print.propTypes = {
    grupper: PT.arrayOf(StatusGruppe),
    bruker: AppPT.motpart.isRequired,
    printMelding: AppPT.printMelding,
};

Print.defaultProps = {
    grupper: undefined,
    printMelding: null,
};

function AktivitetsplanPrintModal({
    sorterteStatusGrupper,
    visPrintMeldingForm,
    fortsettRedigerPrintMelding,
    bruker,
}) {
    const grupper = sorterteStatusGrupper.map(gruppe =>
        <StatusGruppe gruppe={gruppe} key={gruppe.status} />
    );

    const meldingForm = (
        <Modal
            contentLabel="aktivitetsplanPrint"
            className="aktivitetsplanprint"
            header={<PrintHeader />}
        >
            <PrintMelding />
        </Modal>
    );

    const header = (
        <PrintHeader>
            <a
                className="tilbakeknapp"
                onClick={fortsettRedigerPrintMelding}
                role="link"
                tabIndex="0"
            >
                <div className="tilbakeknapp-innhold">
                    <i className="nav-frontend-chevron chevronboks chevron--venstre" />
                    <span className="tilbakeknapp-innhold__tekst">
                        <FormattedMessage id="print.modal.tilbake" />
                    </span>
                </div>
            </a>
            <Hovedknapp
                mini
                className="print-knapp"
                onClick={() => window.print()}
            >
                Skriv ut
            </Hovedknapp>
        </PrintHeader>
    );

    const printVisning = (
        <Modal
            contentLabel="aktivitetsplanPrint"
            className="aktivitetsplanprint"
            header={header}
        >
            <Print grupper={grupper} bruker={bruker} />
        </Modal>
    );

    return (
        <section>
            {visPrintMeldingForm ? meldingForm : printVisning}
        </section>
    );
}

AktivitetsplanPrintModal.propTypes = {
    grupper: PT.arrayOf(StatusGruppe),
    bruker: AppPT.motpart.isRequired,
    visPrintMeldingForm: PT.bool.isRequired,
    fortsettRedigerPrintMelding: PT.func.isRequired,
    aktiviteter: AppPT.aktiviteter.isRequired,
    sorterteStatusGrupper: AppPT.aktiviteter,
};

AktivitetsplanPrintModal.defaultProps = {
    grupper: undefined,
    sorterteStatusGrupper: undefined,
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

    return {
        aktiviteter,
        sorterteStatusGrupper,
        visPrintMeldingForm: skalVisePrintMeldingForm(state),
        bruker,
        printMelding,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        fortsettRedigerPrintMelding: () => dispatch(redigerPrintMelding()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(
    AktivitetsplanPrintModal
);
