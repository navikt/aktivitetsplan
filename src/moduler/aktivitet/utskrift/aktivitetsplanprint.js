import React from 'react';
import { connect } from 'react-redux';
import { Bilde } from 'nav-react-design';
import { Hovedknapp } from 'nav-frontend-knapper';
import * as AppPT from '../../../proptypes';
import Modal from '../../../felles-komponenter/modal/modal';
import PrintHeader from '../../../felles-komponenter/modal/print-header';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetliste-selector';
import logoPng from '../../../img/logo.png';
import StatusGruppe from './statusgruppe';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../constant';

function AktivitetsplanPrint({ sorterteStatusGrupper }) {
    const grupper = sorterteStatusGrupper.map(gruppe =>
        <StatusGruppe gruppe={gruppe} key={gruppe.status} />
    );

    return (
        <section>
            <Modal
                contentLabel="aktivitetsplanPrint"
                className="aktivitetsplanprint"
                header={
                    <PrintHeader tilbakeTekstId="print.modal.tilbake">
                        <Hovedknapp
                            mini
                            className="print-knapp"
                            onClick={() => window.print()}
                        >
                            Skriv ut
                        </Hovedknapp>
                    </PrintHeader>
                }
            >
                <div className="print-modal-body">
                    <Bilde
                        className="nav-logo-print"
                        src={logoPng}
                        alt="Logo NAV"
                    />
                    <h1 className="typo-systemtittel">Aktivitetsplan</h1>
                    {grupper}
                </div>
            </Modal>
        </section>
    );
}

AktivitetsplanPrint.defaultProps = {};

AktivitetsplanPrint.propTypes = {
    aktiviteter: AppPT.aktiviteter.isRequired,
    sorterteStatusGrupper: AppPT.aktiviteter.isRequired,
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

    return {
        aktiviteter,
        sorterteStatusGrupper,
    };
};

export default connect(mapStateToProps)(AktivitetsplanPrint);
