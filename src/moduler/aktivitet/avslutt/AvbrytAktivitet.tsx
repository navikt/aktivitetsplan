import { Loader } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router';

import { Status } from '../../../store/createGenericSlice';
import { AktivitetStatus, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import Modal from '../../../felles-komponenter/modal/Modal';
import { useRoutes } from '../../../routing/useRoutes';
import { avbrytAktivitet } from '../aktivitet-actions';
import { trengerBegrunnelse } from '../aktivitet-util';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import BegrunnelseForm from './BegrunnelseForm';
import ReferatIkkePubliserAdvarsel from './ReferatIkkePubliserAdvarsel';
import VisAdvarsel from './vis-advarsel';
import { RootState } from '../../../store/rootReducer';

const headerTekst = 'Avbrutt aktivitet';
const beskrivelseLabel =
    'Skriv en kort begrunnelse under om hvorfor du avbrøt aktiviteten. ' +
    'Når du lagrer blir aktiviteten låst, og du kan ikke lenger redigere innholdet.';

const AvbrytAktivitet = () => {
    const { id: aktivitetId } = useParams<{ id: string }>();
    const valgtAktivitet = useSelector((state: RootState) =>
        aktivitetId ? selectAktivitetMedId(state, aktivitetId) : undefined,
    );
    const aktivitetListeStatus = useSelector(selectAktivitetListeStatus);
    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();
    const dispatch = useAppDispatch();
    const erVeilarbAktivitet = valgtAktivitet && isVeilarbAktivitet(valgtAktivitet);
    const lagrer = aktivitetListeStatus !== Status.OK;

    if (!erVeilarbAktivitet) return <Navigate to={hovedsideRoute()} replace />;

    const maaBegrunnes =
        valgtAktivitet && trengerBegrunnelse(valgtAktivitet.avtalt, AktivitetStatus.AVBRUTT, valgtAktivitet.type);
    const lagreBegrunnelse = (begrunnelseTekst: string | undefined) =>
        dispatch(avbrytAktivitet(valgtAktivitet, begrunnelseTekst));

    const begrunnelseForm = valgtAktivitet ? (
        <BegrunnelseForm
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseLabel}
            lagrer={lagrer}
            onSubmit={async (beskrivelseForm) => {
                lagreBegrunnelse(beskrivelseForm.begrunnelse);
                navigate(hovedsideRoute());
            }}
        />
    ) : null;
    const advarsel = valgtAktivitet ? (
        <VisAdvarsel
            onSubmit={() => {
                lagreBegrunnelse(undefined);
                navigate(hovedsideRoute());
            }}
        />
    ) : null;

    return (
        <Modal
            lukkPåKlikkUtenfor={false}
            onClose={() => navigate(hovedsideRoute(), { replace: true })}
            heading={'Avbryt aktivitet'}
        >
            {valgtAktivitet ? (
                <ReferatIkkePubliserAdvarsel aktivitet={valgtAktivitet} nyStatus={AktivitetStatus.AVBRUTT}>
                    {maaBegrunnes ? begrunnelseForm : advarsel}
                </ReferatIkkePubliserAdvarsel>
            ) : (
                <Loader />
            )}
        </Modal>
    );
};

export default AvbrytAktivitet;
