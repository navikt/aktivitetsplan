import { endOfToday, formatISO } from 'date-fns';

export const todayIsoString = () => formatISO(endOfToday());

export const sekunderTilMinutter = (sekunder: number): string => {
    const ss = sekunder % 60;
    const mm = Math.floor(sekunder / 60);

    return ('' + mm).padStart(2, '0') + ':' + ('' + ss).padStart(2, '0');
};
