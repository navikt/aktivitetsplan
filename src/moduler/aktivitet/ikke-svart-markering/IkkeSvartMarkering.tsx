import React from 'react';
import { useSelector } from 'react-redux';

import { STATUS_AVBRUTT, STATUS_FULLFOERT, STILLING_FRA_NAV_TYPE } from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import visibleIfHOC from '../../../hocs/visible-if';
import { selectErBruker } from '../../identitet/identitet-selector';
import { CustomAlertstripe } from '../visning/hjelpekomponenter/CustomAlertstripe';

export const SkalIkkeSvartMarkeringVises = (aktivitet: Aktivitet): boolean => {
    const erBruker = useSelector(selectErBruker);

    const erStillingFraNav = aktivitet.type === STILLING_FRA_NAV_TYPE;
    const harIkkeDeltCv = !aktivitet.stillingFraNavData?.cvKanDelesData;
    const status = aktivitet.status;
    const historisk = aktivitet.historisk;
    const ikkeAktiv = status === STATUS_AVBRUTT || status === STATUS_FULLFOERT || !!historisk;

    return erBruker && erStillingFraNav && harIkkeDeltCv && !ikkeAktiv;
};

const IkkeSvartMarkering = () => {
    return <CustomAlertstripe tekst="Venter på svar fra deg" />;
};

export default visibleIfHOC(IkkeSvartMarkering);
