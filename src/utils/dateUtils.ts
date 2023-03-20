import { endOfToday, format, formatISO, subDays } from 'date-fns';

import { toDate } from '../utils';

export const todayIsoString = () => formatISO(endOfToday());

export const dagerSiden = (dato: string, antallDager: number): string | null => {
    const datoDate = toDate(dato);
    if (!datoDate) return null;

    const prevDate = subDays(datoDate, antallDager);
    return format(prevDate, 'yyyy-MM-dd');
};

export const sekunderTilMinutter = (sekunder: number): string => {
    const ss = sekunder % 60;
    const mm = Math.floor(sekunder / 60);

    return ('' + mm).padStart(2, '0') + ':' + ('' + ss).padStart(2, '0');
};
