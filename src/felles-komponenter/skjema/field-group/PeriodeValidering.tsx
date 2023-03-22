import { isAfter, isSameDay, parseISO, startOfDay } from 'date-fns';
import React, { ReactElement } from 'react';

import { erGyldigISODato } from '../../../utils';

export const validerPeriode = (fradato: string, tildato: string) => {
    if (erGyldigISODato(fradato) && erGyldigISODato(tildato)) {
        const til = startOfDay(parseISO(tildato));
        const fra = startOfDay(parseISO(fradato));
        return isSameDay(til, fra) || isAfter(til, fra);
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
    children: ReactElement;
}

const PeriodeValidering = (props: Props) => {
    const { valideringFelt, children } = props;
    const error = valideringFelt.error;
    if (!error) return children;

    return (
        <>
            {children}
            <p id="periode-feil" className="text-red-700 font-bold mb-4">
                {error}
            </p>
        </>
    );
};

export default PeriodeValidering;
