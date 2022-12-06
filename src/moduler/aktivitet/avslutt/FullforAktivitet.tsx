import Spinner from 'nav-frontend-spinner';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';

import { STATUS } from '../../../api/utils';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import { fullforAktivitet } from '../aktivitet-actions';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import BegrunnelseAktivitet from './begrunnelse-form';
import PubliserReferat from './publiser-referat';
import VisAdvarsel from './vis-advarsel';

const headerTekst = 'Fullført aktivitet';
const beskrivelseTekst =
    'Skriv en kort kommentar om hvordan det har gått, eller noe NAV bør kjenne til. ' +
    'Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.';

const FullforAktivitet = () => {
    const { id } = useParams();
    const aktivitetId = id as string; // TODO fix (håndter id undefined)

    const valgtAktivitet = useSelector((state) => selectAktivitetMedId(state, aktivitetId));
    const aktivitetListeStatus = useSelector(selectAktivitetListeStatus);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const doAvsluttOppfolging = (aktivitet: AlleAktiviteter, begrunnelseTekst: string | null) =>
        dispatch(fullforAktivitet(valgtAktivitet, begrunnelseTekst) as unknown as AnyAction);

    const lagrer = aktivitetListeStatus !== STATUS.OK;

    const begrunnelse = valgtAktivitet ? (
        <BegrunnelseAktivitet
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseTekst}
            lagrer={lagrer}
            onSubmit={(beskrivelseForm) => {
                navigate('/', { replace: true });
                return doAvsluttOppfolging(valgtAktivitet, beskrivelseForm.begrunnelse);
            }}
        />
    ) : null;

    const advarsel = valgtAktivitet ? (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                doAvsluttOppfolging(valgtAktivitet, null);
                navigate('/', { replace: true });
            }}
        />
    ) : null;

    return (
        <Modal header={<ModalHeader />} contentLabel="fullfor-aktivitet">
            {valgtAktivitet ? (
                <PubliserReferat aktivitet={valgtAktivitet}>
                    {valgtAktivitet.avtalt &&
                    valgtAktivitet.type !== SAMTALEREFERAT_TYPE &&
                    valgtAktivitet.type !== MOTE_TYPE
                        ? begrunnelse
                        : advarsel}
                </PubliserReferat>
            ) : (
                <Spinner />
            )}
        </Modal>
    );
};

export default FullforAktivitet;
