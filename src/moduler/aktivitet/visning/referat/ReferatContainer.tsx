import { isAfter, parseISO } from 'date-fns';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../../constant';
import { Status } from '../../../../createGenericSlice';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { MoteAktivitet, SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { useErVeileder } from '../../../../Provider';
import { selectUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { publiserReferat } from '../../aktivitet-actions';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import OppdaterReferatForm from './OppdaterReferatForm';
import ReferatVisning from './ReferatVisning';

interface Props {
    aktivitet: MoteAktivitet | SamtalereferatAktivitet;
}

const ReferatContainer = (props: Props) => {
    const { aktivitet } = props;

    const dispatch = useAppDispatch();
    const [isOppdaterReferat, setOppdaterReferat] = useState(false);

    const publiserer = useSelector(selectAktivitetStatus) === (Status.PENDING || Status.RELOADING);
    const erVeileder = useErVeileder();
    const underOppfolging = useSelector(selectUnderOppfolging);

    const { referat, erReferatPublisert, type: aktivitetType } = aktivitet;

    const kanHaReferat =
        (aktivitetType === MOTE_TYPE && isAfter(new Date(), parseISO(aktivitet.fraDato))) ||
        aktivitetType === SAMTALEREFERAT_TYPE;

    const erAktivAktivitet =
        !aktivitet.historisk &&
        underOppfolging &&
        aktivitet.status !== AktivitetStatus.AVBRUTT &&
        aktivitet.status !== AktivitetStatus.FULLFOERT;

    if (!kanHaReferat) return null;

    const manglerReferat = erVeileder && !referat && erAktivAktivitet;
    if (manglerReferat || isOppdaterReferat) {
        return <OppdaterReferatForm aktivitet={aktivitet} onFerdig={() => setOppdaterReferat(false)} />;
    }

    if (referat) {
        return (
            <ReferatVisning
                referat={referat}
                erAktivAktivitet={erAktivAktivitet}
                dispatchPubliserReferat={() => dispatch(publiserReferat(aktivitet))}
                publiserer={publiserer}
                erReferatPublisert={erReferatPublisert}
                startOppdaterReferat={() => setOppdaterReferat(true)}
            />
        );
    }

    return null;
};

export default ReferatContainer;
