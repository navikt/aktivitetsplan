import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { STATUS } from '../../../api/utils';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { useReduxDispatch } from '../../../felles-komponenter/hooks/useReduxDispatch';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import { fullforAktivitet } from '../aktivitet-actions';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import BegrunnelseForm from './BegrunnelseForm';
import PubliserReferat from './PubliserReferat';
import VisAdvarsel from './vis-advarsel';

const headerTekst = 'Fullført aktivitet';
const beskrivelseTekst =
    'Skriv en kort kommentar om hvordan det har gått, eller noe NAV bør kjenne til. ' +
    'Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.';

const FullforAktivitet = () => {
    const { id: aktivitetId } = useParams<{ id: string }>();
    const valgtAktivitet = useSelector((state) => (aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined));
    const lagrer = useSelector((state) => selectAktivitetListeStatus(state)) !== STATUS.OK;

    const dispatch = useReduxDispatch();
    const doAvsluttOppfolging = (aktivitet: AlleAktiviteter, begrunnelse: string | null) =>
        dispatch(fullforAktivitet(aktivitet, begrunnelse));

    const navigate = useNavigate();

    const begrunnelse = (
        <BegrunnelseForm
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseTekst}
            lagrer={lagrer}
            onSubmit={async (beskrivelseForm) => {
                navigate('/', { replace: true });
                if (!valgtAktivitet) return;
                doAvsluttOppfolging(valgtAktivitet, beskrivelseForm.begrunnelse);
            }}
        />
    );

    const advarsel = (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                valgtAktivitet && doAvsluttOppfolging(valgtAktivitet, null);
                navigate('/', { replace: true });
            }}
        />
    );

    if (!valgtAktivitet) return <Navigate to={'/'} />;

    return (
        <Modal header={<ModalHeader />} contentLabel="fullfor-aktivitet">
            <PubliserReferat aktivitet={valgtAktivitet} nyStatus={AktivitetStatus.FULLFOERT}>
                {valgtAktivitet.avtalt &&
                valgtAktivitet.type !== SAMTALEREFERAT_TYPE &&
                valgtAktivitet.type !== MOTE_TYPE
                    ? begrunnelse
                    : advarsel}
            </PubliserReferat>
        </Modal>
    );
};

export default FullforAktivitet;
