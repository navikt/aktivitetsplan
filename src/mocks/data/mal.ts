import { RestRequest } from 'msw';

import { erEksternBruker, ingenMal } from '../demo/sessionstorage';

let maler = [
    {
        mal: 'Jeg vil bli stor og sterk',
        endretAv: 'BRUKER',
        dato: '2017-12-31T09:46:10.971+01:00',
    },
    {
        mal: 'Jeg vil bli sjørøver',
        endretAv: 'BRUKER',
        dato: new Date(),
    },
];

maler = ingenMal() ? [] : maler;

export function malListe() {
    return maler;
}

export function sisteMal() {
    if (maler.length === 0) return maler;
    return maler[maler.length - 1];
}

export async function opprettMal(req: RestRequest) {
    const body = await req.json();

    let nyMal = {
        mal: body.mal,
        endretAv: erEksternBruker() ? 'BRUKER' : 'VEILEDER',
        dato: new Date(),
    };
    maler.push(nyMal);
    return nyMal;
}
