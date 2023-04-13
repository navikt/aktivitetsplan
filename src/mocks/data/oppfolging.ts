import { RestRequest } from 'msw';

import { Oppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { erKRRBruker, erManuellBruker, erPrivatBruker, ingenOppfPerioder } from '../demo/sessionstorage';

const oppfolgingsperioder: Oppfolgingsperiode[] = [
    {
        uuid: 'a1aa11a1-1aa1-4e02-8cc2-d44ef605fa33',
        aktorId: '1234567988888',
        veileder: null,
        startDato: '2017-01-30T10:46:10.971+01:00',
        sluttDato: '2017-12-31T10:46:10.971+01:00',
        begrunnelse: null,
        kvpPerioder: [
            {
                opprettetDato: '2017-01-30T10:46:10.971+01:00',
                avsluttetDato: '2017-06-01T10:46:10.971+01:00',
            },
            {
                opprettetDato: '2017-06-30T10:46:10.971+01:00',
                avsluttetDato: '2017-12-01T10:46:10.971+01:00',
            },
        ],
    },
    {
        uuid: 'a2aa22a2-2aa2-4e02-8cc2-d44ef605fa33',
        aktorId: '1234567988888',
        veileder: null,
        startDato: '2018-01-31T10:46:10.971+01:00',
        sluttDato: null,
        begrunnelse: null,
    },
];

const oppfolging = {
    fnr: null,
    aktorId: '1234567988888',
    veilederId: null,
    reservasjonKRR: erKRRBruker(),
    manuell: erManuellBruker(),
    underOppfolging: !erPrivatBruker(),
    underKvp: false,
    oppfolgingUtgang: null,
    kanStarteOppfolging: false,
    avslutningStatus: null,
    oppfolgingsPerioder: ingenOppfPerioder() ? [] : oppfolgingsperioder,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    servicegruppe: 'IVURD',
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00',
};

export const mockOppfolging = oppfolging;

export const getOppfolging = (req: RestRequest) => {
    return { ...oppfolging, fnr: req.url.searchParams.get('fnr') ?? undefined };
};

export function settDigital() {
    oppfolging.manuell = false;
    return oppfolging;
}

export const avslutningStatus = () => {
    (oppfolging as any).avslutningStatus = {
        kanAvslutte: true,
        underOppfolging: false,
        harYtelser: true,
        harTiltak: true,
        underKvp: false,
        inaktiveringsDato: '2018-06-05T00:00:00+02:00',
    };
    return oppfolging;
};

export default getOppfolging;
