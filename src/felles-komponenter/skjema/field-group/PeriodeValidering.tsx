import moment from 'moment';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import React, { ReactNode } from 'react';

import { erGyldigISODato } from '../../../utils';
import styles from './PeriodeValidering.module.css';

export const validerPeriode = (fradato: string, tildato: string) => {
    if (erGyldigISODato(fradato) && erGyldigISODato(tildato)) {
        const momentTilDato = moment(tildato).startOf('day');
        const momentFraDato = moment(fradato).startOf('day');
        return momentTilDato.isSameOrAfter(momentFraDato);
    }
    return true;
};

export const validerPeriodeFelt = (fraDato: string, tilDato: string) => {
    const isValidPeriode = !validerPeriode(fraDato, tilDato);
    return isValidPeriode ? 'Fra dato kan ikke være etter til dato' : undefined;
};

interface ValideringFelt {
    name?: string;
    error?: string;
    input: { name: string };
}

interface Props {
    valideringFelt: ValideringFelt;
    children: ReactNode;
}

const PeriodeValidering = (props: Props) => {
    const { valideringFelt, children } = props;

    return (
        <SkjemaGruppe
            className={styles.marginBottom}
            feilmeldingId="periode-feil"
            feil={valideringFelt.error}
            tag="div"
        >
            {children}
        </SkjemaGruppe>
    );
};

export default PeriodeValidering;
