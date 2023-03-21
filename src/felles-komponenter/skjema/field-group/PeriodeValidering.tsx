import moment from 'moment';
import React, { ReactElement } from 'react';

import { erGyldigISODato } from '../../../utils';

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
