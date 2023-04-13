import { isAfter, parseISO } from 'date-fns';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { STATUS } from '../../../../api/utils';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../../constant';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { MoteAktivitet, SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
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

    const dispatch = useDispatch();
    const [isOppdaterReferat, setOppdaterReferat] = useState(false);

    const publiserer = useSelector(selectAktivitetStatus) === (STATUS.PENDING || STATUS.RELOADING);
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

    if (!!referat) {
        return (
            <ReferatVisning
                referat={referat}
                erAktivAktivitet={erAktivAktivitet}
                dispatchPubliserReferat={() => dispatch(publiserReferat(aktivitet) as unknown as AnyAction)}
                publiserer={publiserer}
                erReferatPublisert={erReferatPublisert}
                startOppdaterReferat={() => setOppdaterReferat(true)}
            />
        );
    }

    return null;
};

export default ReferatContainer;
