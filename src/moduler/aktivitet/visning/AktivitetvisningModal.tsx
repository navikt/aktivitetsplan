import React, { useContext } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AktivitetStatus, AlleAktiviteter, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import { Avhengighet } from '../../../felles-komponenter/utils/Innholdslaster';
import { useRoutes } from '../../../routing/useRoutes';
import { aktivitetStatusMap, getAktivitetType } from '../../../utils/textMappers';
import { DirtyContext } from '../../context/dirty-context';
import { selectDialogFeilmeldinger } from '../../dialog/dialog-selector';
import { selectErBruker } from '../../identitet/identitet-selector';
import { selectNivaa4Feilmeldinger } from '../../tilgang/tilgang-selector';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';
import { selectArenaFeilmeldinger } from '../arena-aktivitet-selector';
import { skalMarkereForhaandsorienteringSomLest } from './avtalt-container/utilsForhaandsorientering';

const header = (valgtAktivitet?: AlleAktiviteter) => {
    if (!valgtAktivitet) {
        return null;
    }

    const aktivitetErLaast =
        valgtAktivitet.status === AktivitetStatus.FULLFOERT || valgtAktivitet.status === AktivitetStatus.AVBRUTT;

    return (
        <ModalHeader
            headerTekst={`${aktivitetStatusMap[valgtAktivitet.status]} / ${getAktivitetType(valgtAktivitet)}`}
            aktivitetErLaast={aktivitetErLaast}
        />
    );
};

const DIALOG_TEKST = 'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

interface Props {
    aktivitet?: AlleAktiviteter;
    avhengigheter: Avhengighet[];
    children: React.ReactNode;
}

const emptySelector = () => [];

const AktivitetvisningModal = (props: Props) => {
    const { aktivitet, avhengigheter, children } = props;
    const dirty = useContext(DirtyContext);
    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();
    const tilHovedside = () => navigate(hovedsideRoute());

    const selectFeilMeldinger = (a: AlleAktiviteter) =>
        isArenaAktivitet(a) ? selectArenaFeilmeldinger : selectAktivitetFeilmeldinger;
    const aktivitetFeilSelector = aktivitet === undefined ? emptySelector : selectFeilMeldinger(aktivitet);

    const aktivitetFeil = useSelector(aktivitetFeilSelector, shallowEqual);
    const nivaa4Feil = useSelector(selectNivaa4Feilmeldinger, shallowEqual);
    const dialogFeil = useSelector(selectDialogFeilmeldinger, shallowEqual);
    const alleFeil = [...aktivitetFeil, ...dialogFeil, ...nivaa4Feil];
    const erBruker = useSelector(selectErBruker);

    const fho = aktivitet?.forhaandsorientering;
    const skalLeses = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    return (
        <Modal
            onClose={tilHovedside}
            avhengigheter={avhengigheter}
            subHeading={
                aktivitet ? `${aktivitetStatusMap[aktivitet.status]} / ${getAktivitetType(aktivitet)}` : undefined
            }
            heading={aktivitet?.tittel || ''}
            onRequestClose={() => {
                if (dirty.isDirty && !window.confirm(DIALOG_TEKST)) {
                    return false;
                }
                if (skalLeses && fho) {
                    window.alert('Det er en viktig beskjed om ansvaret ditt som du må lese.');
                    return false;
                }
                navigate(hovedsideRoute());
                return true;
            }}
            feilmeldinger={alleFeil}
        >
            {children}
        </Modal>
    );
};

export default AktivitetvisningModal;
