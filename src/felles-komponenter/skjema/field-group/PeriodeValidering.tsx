import { SkjemaGruppe } from 'nav-frontend-skjema';
import React, { ReactNode } from 'react';

import { erGyldigISODato, isSameOrAfter } from '../../../utils';
import styles from './PeriodeValidering.module.less';

export const validerPeriode = (fradato: string, tildato: string) => {
    if (erGyldigISODato(fradato) && erGyldigISODato(tildato)) {
        isSameOrAfter(tildato, fradato);
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
