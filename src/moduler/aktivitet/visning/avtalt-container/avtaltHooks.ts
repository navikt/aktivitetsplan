import { useSelector } from 'react-redux';

import { AktivitetType } from '../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';
import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { Oppfolgingsperiode } from '../../../../datatypes/oppfolgingTypes';
import { useErBrukerDigital } from '../../../../felles-komponenter/hooks/useBrukerDigital';
import { loggForhandsorientering, metrikkTidForsteAvtalte } from '../../../../felles-komponenter/utils/logging';
import { erGyldigISODato, msSince } from '../../../../utils/dateUtils';
import { selectErUnderKvp, selectOppfolgingsPerioder } from '../../../oppfolging-status/oppfolging-selector';
import { selectAktiviteterData } from '../../aktivitet-selector';

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

    const aktivOppfolgingsPeriode = useSelector<any, Oppfolgingsperiode[]>(selectOppfolgingsPerioder).filter(
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
