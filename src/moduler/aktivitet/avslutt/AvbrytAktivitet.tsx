import { Loader } from '@navikt/ds-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AnyAction } from 'redux';

import { STATUS } from '../../../api/utils';
import { STATUS_AVBRUTT } from '../../../constant';
import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import Modal from '../../../felles-komponenter/modal/Modal';
import { avbrytAktivitet } from '../aktivitet-actions';
import { trengerBegrunnelse } from '../aktivitet-util';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import PubliserReferat from './publiser-referat';
import VisAdvarsel from './vis-advarsel';

const headerTekst = 'Avbrutt aktivitet';
const beskrivelseLabel =
    'Skriv en kort begrunnelse under om hvorfor du avbrøt aktiviteten. ' +
    'Når du lagrer blir aktiviteten låst, og du kan ikke lenger redigere innholdet.';

interface Props {
    match: { params: { id: string } };
}

const AvbrytAktivitet = (props: Props) => {
    const { match } = props;
    const aktivitetId = match.params.id;

    const valgtAktivitet = useSelector((state) => selectAktivitetMedId(state, aktivitetId));
    const aktivitetListeStatus = useSelector(selectAktivitetListeStatus);

    const history = useHistory();
    const dispatch = useDispatch();

    const lagreBegrunnelse = (aktivitet: AlleAktiviteter, begrunnelseTekst: string | null) =>
        dispatch(avbrytAktivitet(valgtAktivitet, begrunnelseTekst) as unknown as AnyAction);

    const lagrer = aktivitetListeStatus !== STATUS.OK;

    const begrunnelse = valgtAktivitet ? (
        <BegrunnelseAktivitet
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseLabel}
            lagrer={lagrer}
            onSubmit={(beskrivelseForm) => {
                history.replace('/');
                return lagreBegrunnelse(valgtAktivitet, beskrivelseForm.begrunnelse);
            }}
        />
    ) : null;

    const advarsel = valgtAktivitet ? (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                lagreBegrunnelse(valgtAktivitet, null);
                history.replace('/');
            }}
        />
    ) : null;

    const maaBegrunnes =
        valgtAktivitet && trengerBegrunnelse(valgtAktivitet.avtalt, STATUS_AVBRUTT, valgtAktivitet.type);

    return (
        <Modal contentLabel="avbryt-aktivitet">
            {valgtAktivitet ? (
                <PubliserReferat aktivitet={valgtAktivitet} nyStatus={STATUS_AVBRUTT}>
                    {maaBegrunnes ? begrunnelse : advarsel}
                </PubliserReferat>
            ) : (
                <Loader />
            )}
        </Modal>
    );
};

export default AvbrytAktivitet;
