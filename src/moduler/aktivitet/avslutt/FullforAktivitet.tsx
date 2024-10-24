import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { Status } from '../../../createGenericSlice';
import { AktivitetStatus, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import Modal from '../../../felles-komponenter/modal/Modal';
import { useRoutes } from '../../../routing/useRoutes';
import { RootState } from '../../../store';
import { fullforAktivitet } from '../aktivitet-actions';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import BegrunnelseForm from './BegrunnelseForm';
import PubliserReferat from './PubliserReferat';
import VisAdvarsel from './vis-advarsel';

const headerTekst = 'Fullført aktivitet';
const beskrivelseTekst =
    'Skriv en kort kommentar om hvordan det har gått, eller noe Nav bør kjenne til. ' +
    'Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.';

const FullforAktivitet = () => {
    const { id: aktivitetId } = useParams<{ id: string }>();
    const valgtAktivitet = useSelector((state: RootState) =>
        aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined,
    );
    const lagrer = useSelector((state: RootState) => selectAktivitetListeStatus(state)) !== Status.OK;

    const dispatch = useAppDispatch();
    const doAvsluttOppfolging = (aktivitet: VeilarbAktivitet, begrunnelse: string | null) =>
        dispatch(fullforAktivitet(aktivitet, begrunnelse));

    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();

    if (!valgtAktivitet || isArenaAktivitet(valgtAktivitet)) return <Navigate to={hovedsideRoute()} />;

    const begrunnelse = (
        <BegrunnelseForm
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseTekst}
            lagrer={lagrer}
            onSubmit={async (beskrivelseForm) => {
                navigate(hovedsideRoute(), { replace: true });
                if (!valgtAktivitet) return;
                doAvsluttOppfolging(valgtAktivitet, beskrivelseForm.begrunnelse);
            }}
        />
    );

    const advarsel = (
        <VisAdvarsel
            onSubmit={() => {
                valgtAktivitet && doAvsluttOppfolging(valgtAktivitet, null);
                navigate(hovedsideRoute());
            }}
        />
    );

    return (
        <Modal onClose={() => navigate(hovedsideRoute(), { replace: true })} heading="Fullfør aktivitet">
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
