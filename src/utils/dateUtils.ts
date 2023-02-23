import { endOfToday, format, formatISO, subDays } from 'date-fns';

import { toDate } from '../utils';

export const todayIsoString = () => formatISO(endOfToday());

export const dagerSiden = (dato: string, antallDager: number): string | null => {
    let datoDate = toDate(dato);
    if (!datoDate) return null;

    const prevDate = subDays(datoDate, antallDager);
    return format(prevDate, 'yyyy-MM-dd');
};
