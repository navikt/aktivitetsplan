import { endOfToday, formatISO } from 'date-fns';

export const todayIsoString = () => formatISO(endOfToday());
