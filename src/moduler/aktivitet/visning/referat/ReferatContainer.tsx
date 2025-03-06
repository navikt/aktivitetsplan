import { isBefore, parseISO, subMinutes } from 'date-fns';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE } from '../../../../constant';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import {
    MoteAktivitet,
    SamtalereferatAktivitet,
    VeilarbAktivitetType,
} from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { useErVeileder } from '../../../../Provider';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { publiserReferat } from '../../aktivitet-actions';
import OppdaterReferatForm from './OppdaterReferatForm';
import ReferatVisning from './ReferatVisning';

interface Props {
    aktivitet: MoteAktivitet | SamtalereferatAktivitet;
}

const sjekkErFullførtEllerAvbrutt = (status: AktivitetStatus) =>
    [AktivitetStatus.AVBRUTT, AktivitetStatus.FULLFOERT].includes(status);

const sjekKanIkkeHaReferat = (
    aktivitetType: VeilarbAktivitetType.MOTE_TYPE | VeilarbAktivitetType.SAMTALEREFERAT_TYPE,
    fraDato: string,
    erFullfortEllerAvbrutt: boolean,
) => {
    /* Kan ikke opprette referat på møter som ikke har vært */
    if (aktivitetType === MOTE_TYPE && !erFullfortEllerAvbrutt) {
        const now = new Date();
        const fraDatoMedSlack = subMinutes(parseISO(fraDato), 15);
        return isBefore(now, fraDatoMedSlack);
    } else {
        return false;
    }
};

const ReferatContainer = (props: Props) => {
    const { aktivitet } = props;
    const { referat, erReferatPublisert, type: aktivitetType } = aktivitet;

    const dispatch = useAppDispatch();
    const [oppdatererReferat, setOppdatererReferat] = useState(false);

    const erVeileder = useErVeileder();
    const underOppfolging = useSelector(selectErUnderOppfolging);

    const erFullførtEllerAvbrutt = sjekkErFullførtEllerAvbrutt(aktivitet.status);
    const kanIkkeHaReferatEnda = sjekKanIkkeHaReferat(aktivitetType, aktivitet.fraDato, erFullførtEllerAvbrutt);
    const erAktivAktivitet = !aktivitet.historisk && underOppfolging && !erFullførtEllerAvbrutt;
    const manglerReferat = erVeileder && !referat && erAktivAktivitet;

    if (kanIkkeHaReferatEnda) {
        return null;
    } else if (manglerReferat || oppdatererReferat) {
        return <OppdaterReferatForm aktivitet={aktivitet} onFerdig={() => setOppdatererReferat(false)} />;
    } else if (referat) {
        return (
            <ReferatVisning
                referat={referat}
                erAktivAktivitet={erAktivAktivitet}
                dispatchPubliserReferat={() => dispatch(publiserReferat(aktivitet))}
                erReferatPublisert={erReferatPublisert}
                startOppdaterReferat={() => setOppdatererReferat(true)}
            />
        );
    } else {
        return null;
    }
};

export default ReferatContainer;
