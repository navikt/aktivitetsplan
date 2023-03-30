import { Loader } from '@navikt/ds-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';

import { STATUS } from '../../../api/utils';
import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import Modal from '../../../felles-komponenter/modal/Modal';
import { avbrytAktivitet } from '../aktivitet-actions';
import { trengerBegrunnelse } from '../aktivitet-util';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import BegrunnelseForm from './BegrunnelseForm';
import PubliserReferat from './PubliserReferat';
import VisAdvarsel from './vis-advarsel';

const headerTekst = 'Avbrutt aktivitet';
const beskrivelseLabel =
    'Skriv en kort begrunnelse under om hvorfor du avbrøt aktiviteten. ' +
    'Når du lagrer blir aktiviteten låst, og du kan ikke lenger redigere innholdet.';

const AvbrytAktivitet = () => {
    const { id: aktivitetId } = useParams<{ id: string }>();
    const valgtAktivitet = useSelector((state) => (aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined));
    const aktivitetListeStatus = useSelector(selectAktivitetListeStatus);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const lagreBegrunnelse = (aktivitet: AlleAktiviteter, begrunnelseTekst: string | null) =>
        dispatch(avbrytAktivitet(valgtAktivitet, begrunnelseTekst) as unknown as AnyAction);

    const lagrer = aktivitetListeStatus !== STATUS.OK;

    const begrunnelse = valgtAktivitet ? (
        <BegrunnelseForm
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseLabel}
            lagrer={lagrer}
            onSubmit={async (beskrivelseForm) => {
                navigate('/', { replace: true });
                lagreBegrunnelse(valgtAktivitet, beskrivelseForm.begrunnelse);
            }}
        />
    ) : null;

    const advarsel = valgtAktivitet ? (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                lagreBegrunnelse(valgtAktivitet, null);
                navigate('/');
            }}
        />
    ) : null;

    const maaBegrunnes =
        valgtAktivitet &&
        trengerBegrunnelse(valgtAktivitet.avtalt, AktivitetStatus.STATUS_AVBRUTT, valgtAktivitet.type);

    return (
        <Modal contentLabel="Avbryt aktivitet">
            {valgtAktivitet ? (
                <PubliserReferat aktivitet={valgtAktivitet} nyStatus={AktivitetStatus.STATUS_AVBRUTT}>
                    {maaBegrunnes ? begrunnelse : advarsel}
                </PubliserReferat>
            ) : (
                <Loader />
            )}
        </Modal>
    );
};

export default AvbrytAktivitet;
