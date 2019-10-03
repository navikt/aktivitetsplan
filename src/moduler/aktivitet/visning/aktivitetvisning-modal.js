import React, { useContext } from 'react';
import PT from 'prop-types';
import * as AppPT from '../../../proptypes';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../../constant';
import { DirtyContext } from '../../context/dirty-context';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';

const statusMap = {
    PLANLAGT: 'Planlegger',
    BRUKER_ER_INTERESSERT: 'Forslag',
    GJENNOMFORES: 'Gjennomfører',
    FULLFORT: 'Fullført',
    AVBRUTT: 'Avbrutt'
};

const typeMap = {
    EGEN: 'Jobbrettet egenaktivitet',
    STILLING: 'Stilling',
    TILTAKSAKTIVITET: 'Tiltak gjennom NAV',
    GRUPPEAKTIVITET: 'Gruppeaktivitet',
    UTDANNINGSAKTIVITET: 'Utdanning',
    SOKEAVTALE: 'Jobbsøking',
    IJOBB: 'Jobb jeg har nå',
    BEHANDLING: 'Behandling',
    MOTE: 'Møte med NAV',
    SAMTALEREFERAT: 'Samtalereferat'
};

function header(valgtAktivitet) {
    if (!valgtAktivitet) {
        return null;
    }

    const aktivitetErLaast = valgtAktivitet.status === STATUS_FULLFOERT || valgtAktivitet.status === STATUS_AVBRUTT;

    return (
        <ModalHeader
            headerTekst={`${statusMap[valgtAktivitet.status]} / ${typeMap[valgtAktivitet.type]}`}
            aria-labelledby="modal-aktivitetsvisning-header"
            aktivitetErLaast={aktivitetErLaast}
        />
    );
}

const DIALOG_TEKST = 'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

function AktivitetvisningModal(props) {
    const { aktivitet, avhengigheter, history, children } = props;

    const dirty = useContext(DirtyContext);

    return (
        <Modal
            contentLabel="aktivitetsvisning-modal"
            contentClass="aktivitetsvisning"
            avhengigheter={avhengigheter}
            header={header(aktivitet)}
            onRequestClose={() => {
                if (!dirty.isDirty || window.confirm(DIALOG_TEKST)) {
                    history.push('/');
                }
            }}
        >
            {children}
        </Modal>
    );
}

AktivitetvisningModal.defaultProps = {
    aktivitet: undefined
};

AktivitetvisningModal.propTypes = {
    aktivitet: AppPT.aktivitet,
    avhengigheter: AppPT.avhengigheter.isRequired,
    history: AppPT.history.isRequired,
    children: PT.object.isRequired
};

export default AktivitetvisningModal;
