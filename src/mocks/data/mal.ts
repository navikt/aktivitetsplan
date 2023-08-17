import { RestRequest } from 'msw';

import { Mal } from '../../datatypes/oppfolgingTypes';
import { erEksternBruker, ingenMal } from '../demo/localStorage';

let maler: Mal[] = [
    {
        mal: 'Jeg vil bli stor og sterk',
        endretAv: 'BRUKER',
        dato: '2017-12-31T09:46:10.971+01:00',
    },
    {
        mal: 'Jeg vil bli sjørøver',
        endretAv: 'BRUKER',
        dato: new Date().toISOString(),
    },
];

const tomMal: Mal = { dato: undefined, endretAv: 'VEILEDER', mal: undefined };

maler = ingenMal() ? [] : maler;

export function malListe() {
    return maler;
}

export function sisteMal() {
    if (maler.length === 0) return tomMal;
    return maler[maler.length - 1];
}

export async function opprettMal(req: RestRequest) {
    const body = await req.json();

    const nyMal = {
        mal: body.mal,
        endretAv: erEksternBruker() ? 'BRUKER' : 'VEILEDER',
        dato: new Date().toISOString(),
    } as Mal;
    maler.push(nyMal);
    return nyMal;
}
