import { useSelector } from 'react-redux';

import { AktivitetType } from '../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';
import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { useErBrukerDigital } from '../../../../felles-komponenter/hooks/useBrukerDigital';
import { loggForhandsorientering, metrikkTidForsteAvtalte } from '../../../../felles-komponenter/utils/logging';
import { erGyldigISODato, msSince } from '../../../../utils/dateUtils';
import { selectErUnderKvp, selectOppfolgingsPerioder } from '../../../oppfolging-status/oppfolging-selector';
import { selectAktiviteterData } from '../../aktivitet-slice';

export const useKanSendeVarsel = () => {
    const erKvp = useSelector(selectErUnderKvp);
    const erDigital = useErBrukerDigital();

    return erDigital && !erKvp;
};

export const useSendAvtaltMetrikker = () => {
    const harAvtalteAktiviteter =
        useSelector<any, VeilarbAktivitet[]>(selectAktiviteterData)
            .filter((aktivitet) => aktivitet.avtalt)
            .filter((a) => !a.historisk).length !== 0;

    const aktivOppfolgingsPeriode = useSelector(selectOppfolgingsPerioder).filter((periode) => !periode.slutt)[0];
    const kanSendeVarsel = useKanSendeVarsel();

    return (
        forhaandsorienteringsType: ForhaandsorienteringType,
        aktivitetType: AktivitetType,
        mindreEnnSyvDagerTil: boolean,
    ) => {
        loggForhandsorientering(!kanSendeVarsel, mindreEnnSyvDagerTil, forhaandsorienteringsType, aktivitetType);

        if (!harAvtalteAktiviteter && aktivOppfolgingsPeriode && erGyldigISODato(aktivOppfolgingsPeriode.start)) {
            metrikkTidForsteAvtalte(msSince(aktivOppfolgingsPeriode.start));
        }
    };
};
