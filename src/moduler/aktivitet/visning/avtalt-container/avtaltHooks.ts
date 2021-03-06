import { useSelector } from 'react-redux';

import { Aktivitet, AktivitetType, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { OppfolgingsPeriode } from '../../../../datatypes/oppfolgingTypes';
import { useErBrukerDigital } from '../../../../felles-komponenter/hooks/useBrukerDigital';
import { loggForhandsorientering, metrikkTidForsteAvtalte } from '../../../../felles-komponenter/utils/logging';
import { erGyldigISODato, msSince } from '../../../../utils';
import { selectErUnderKvp, selectOppfolgingsPerioder } from '../../../oppfolging-status/oppfolging-selector';
import { selectAktiviteterData } from '../../aktivitet-selector';

export const useKanSendeVarsel = () => {
    const erKvp = useSelector(selectErUnderKvp);
    const erDigital = useErBrukerDigital();

    return erDigital && !erKvp;
};

export const useSendAvtaltMetrikker = () => {
    const harAvtalteAktiviteter =
        useSelector<any, Aktivitet[]>(selectAktiviteterData)
            .filter((aktivitet) => aktivitet.avtalt)
            .filter((a) => !a.historisk).length !== 0;

    const aktivOppfolgingsPeriode = useSelector<any, OppfolgingsPeriode[]>(selectOppfolgingsPerioder).filter(
        (periode) => !periode.sluttDato
    )[0];
    const kanSendeVarsel = useKanSendeVarsel();

    return (
        forhaandsorienteringsType: ForhaandsorienteringType,
        aktivitetType: AktivitetType,
        mindreEnnSyvDagerTil: boolean
    ) => {
        loggForhandsorientering(!kanSendeVarsel, mindreEnnSyvDagerTil, forhaandsorienteringsType, aktivitetType);

        if (!harAvtalteAktiviteter && aktivOppfolgingsPeriode && erGyldigISODato(aktivOppfolgingsPeriode.startDato)) {
            metrikkTidForsteAvtalte(msSince(aktivOppfolgingsPeriode.startDato));
        }
    };
};
