import { RestRequest } from 'msw';

import { Oppfolgingsperiode, OppfolgingStatus } from '../../datatypes/oppfolgingTypes';
import {
    erIkkeRegistrertIKRR,
    erKRRBruker,
    erManuellBruker,
    erPrivatBruker,
    ingenOppfPerioder, kanIkkeVarsles
} from '../demo/localStorage';
import { mockfnr } from '../utils';

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
        uuid: 'a3aa11a1-1aa1-4e02-8cc2-d44ef605fa33',
        aktorId: '1234567988888',
        veileder: null,
        startDato: '2016-01-30T10:46:10.971+01:00',
        sluttDato: '2016-12-31T10:46:10.971+01:00',
        begrunnelse: null,
        kvpPerioder: [],
    },
    {
        uuid: 'a2aa22a2-2aa2-4e02-8cc2-d44ef605fa33',
        aktorId: '1234567988888',
        veileder: null,
        startDato: '2018-01-31T10:46:10.971+01:00',
        sluttDato: undefined,
        begrunnelse: null,
    },
];

const oppfolging = {
    fnr: mockfnr,
    aktorId: '1234567988888',
    veilederId: null,
    reservasjonKRR: erKRRBruker(),
    manuell: erManuellBruker(),
    underOppfolging: !erPrivatBruker(),
    underKvp: false,
    kanStarteOppfolging: false,
    oppfolgingsPerioder: ingenOppfPerioder() ? [] : oppfolgingsperioder,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    servicegruppe: 'IVURD',
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00',
    kanVarsles: !kanIkkeVarsles(),
    registrertKRR : !erIkkeRegistrertIKRR(),
} as Partial<OppfolgingStatus>;

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
