import { endOfToday, formatISO, subDays } from 'date-fns';
import { dateToISODateString } from 'nav-datovelger/lib/utils/dateFormatUtils';

import { toDate } from '../utils';

export const todayIsoString = () => formatISO(endOfToday());

export const dagerSiden = (dato: String, dagerSiden: number) => {
    let datoDate = toDate(dato);
    if (!datoDate) return null;

    const prevDate = subDays(datoDate, dagerSiden);
    return dateToISODateString(prevDate);
};
