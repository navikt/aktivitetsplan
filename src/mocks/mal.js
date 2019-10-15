import { erEksternBruker } from './demo/sessionstorage';

export const maler = [
    {
        mal: 'Jeg vil bli stor og sterk',
        endretAv: 'BRUKER',
        dato: '2017-12-31T09:46:10.971+01:00'
    },
    {
        mal: 'Jeg vil bli sjørøver',
        endretAv: 'BRUKER',
        dato: new Date()
    }
];

export function malListe() {
    return maler;
}

export function sisteMal() {
    if (maler.length === 0) return maler;
    return maler[maler.length - 1];
}

export function opprettMal(update) {
    let nyMal = {
        mal: update.mal,
        endretAv: erEksternBruker() ? 'BRUKER' : 'VEILEDER',
        dato: new Date()
    };
    maler.push(nyMal);
    return nyMal;
}
