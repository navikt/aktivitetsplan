import React, { useContext } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import { Avhengighet } from '../../../felles-komponenter/utils/Innholdslaster';
import { DirtyContext } from '../../context/dirty-context';
import { selectDialogFeilmeldinger } from '../../dialog/dialog-selector';
import { selectErBruker } from '../../identitet/identitet-selector';
import { selectNivaa4Feilmeldinger } from '../../tilgang/tilgang-selector';
import { markerForhaandsorienteringSomLest } from '../aktivitet-actions';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';
import { selectArenaFeilmeldinger } from '../arena-aktivitet-selector';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../arena-aktiviteter-reducer';
import { skalMarkereForhaandsorienteringSomLest } from './avtalt-container/utilsForhaandsorientering';

const statusMap = {
    PLANLAGT: 'Planlegger',
    BRUKER_ER_INTERESSERT: 'Forslag',
    GJENNOMFORES: 'Gjennomfører',
    FULLFORT: 'Fullført',
    AVBRUTT: 'Avbrutt',
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
    SAMTALEREFERAT: 'Samtalereferat',
};

const header = (valgtAktivitet?: Aktivitet) => {
    if (!valgtAktivitet) {
        return null;
    }

    const aktivitetErLaast = valgtAktivitet.status === STATUS_FULLFOERT || valgtAktivitet.status === STATUS_AVBRUTT;

    return (
        <ModalHeader
            headerTekst={`${statusMap[valgtAktivitet.status]} / ${typeMap[valgtAktivitet.type]}`}
            aria-describedby="modal-aktivitetsvisning-header"
            aktivitetErLaast={aktivitetErLaast}
        />
    );
};

const DIALOG_TEKST = 'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

interface Props {
    aktivitet?: Aktivitet;
    avhengigheter: Avhengighet[];
    children: React.ReactNode;
}

const AktivitetvisningModal = (props: Props) => {
    const { aktivitet, avhengigheter, children } = props;
    const dirty = useContext(DirtyContext);
    const history = useHistory();
    const dispatch = useDispatch();
    const selector = aktivitet?.arenaAktivitet ? selectArenaFeilmeldinger : selectAktivitetFeilmeldinger;

    const aktivitetFeil = useSelector(selector, shallowEqual);
    const nivaa4Feil = useSelector(selectNivaa4Feilmeldinger, shallowEqual);
    const dialogFeil = useSelector(selectDialogFeilmeldinger, shallowEqual);
    const alleFeil = aktivitetFeil.concat(dialogFeil).concat(nivaa4Feil);
    const erBruker = useSelector(selectErBruker);

    const fho = aktivitet?.forhaandsorientering;
    const skalLeses = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    const markerFhoSomLest = () => {
        if (aktivitet?.arenaAktivitet) {
            dispatch(markerForhaandsorienteringSomLestArenaAktivitet(aktivitet));
        } else {
            dispatch(markerForhaandsorienteringSomLest(aktivitet));
        }
    };

    return (
        <Modal
            contentLabel="aktivitetsvisning-modal"
            contentClass="aktivitetsvisning"
            avhengigheter={avhengigheter}
            header={header(aktivitet)}
            onRequestClose={() => {
                if (dirty.isDirty && window.confirm(DIALOG_TEKST) && !skalLeses) {
                    history.push('/');
                }
                if (skalLeses && fho && window.confirm(fho.tekst)) {
                    markerFhoSomLest();
                    history.push('/');
                }
            }}
            feilmeldinger={alleFeil}
        >
            {children}
        </Modal>
    );
};

export default AktivitetvisningModal;
