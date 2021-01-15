import { useSelector } from 'react-redux';

import { Aktivitet, AktivitetType } from '../../../../datatypes/aktivitetTypes';
import { OppfolgingsPeriode } from '../../../../datatypes/oppfolgingTypes';
import { loggForhandsorientering, metrikkTidForsteAvtalte } from '../../../../felles-komponenter/utils/logging';
import { erGyldigISODato, msSince } from '../../../../utils';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectOppfolgingsPerioder,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../../tilgang/tilgang-selector';
import { selectAktiviteterData } from '../../aktivitet-selector';

export const useKanSendeVarsel = () => {
    const erManuell = useSelector(selectErBrukerManuell);
    const erKvp = useSelector(selectErUnderKvp);
    const erreservertKRR = useSelector(selectReservasjonKRR);
    const harNivaa4 = useSelector(selectNivaa4);

    return !(erManuell || erKvp || erreservertKRR || !harNivaa4);
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

    return (forhaandsorenteringsType: string, aktivitetType: AktivitetType, mindreEnnSyvDagerTil: boolean) => {
        loggForhandsorientering(!kanSendeVarsel, mindreEnnSyvDagerTil, forhaandsorenteringsType, aktivitetType);

        if (!harAvtalteAktiviteter && aktivOppfolgingsPeriode && erGyldigISODato(aktivOppfolgingsPeriode.startDato)) {
            metrikkTidForsteAvtalte(msSince(aktivOppfolgingsPeriode.startDato));
        }
    };
};
