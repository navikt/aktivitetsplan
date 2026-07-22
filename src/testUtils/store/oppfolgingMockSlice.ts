import { OppfolgingsPeriode, OppfolgingStatusResponse } from '../../api/veilarboppfolging';
import { Status } from '../../store/createGenericSlice';
import { aktivVeilarbOppfolgingMockPeriode } from './defaultInitialStore';
import { RootState } from '../../store/rootReducer';

const defaultOppfolgingData: OppfolgingStatusResponse = {
    oppfolging: {
        erUnderOppfolging: true,
    },
    oppfolgingsPerioder: [aktivVeilarbOppfolgingMockPeriode],
    brukerStatus: {
        arena: {
            inaktiveringsdato: undefined,
            kanReaktiveres: false,
        },
        manuell: {
            erManuell: false,
        },
        krr: {
            registrertIKrr: true,
            reservertIKrr: false,
            kanVarsles: true,
        },
    },
};

/* 1 aktiv oppfolgingsperide, alt annet OK */
export const defaultOppfolging: OppfolgingSliceState = { data: defaultOppfolgingData, status: Status.OK };

export interface OppfolgingSliceState {
    data: OppfolgingStatusResponse;
    status: Status;
}

export const oppfolgingMockSlice = {
    medPerioder: (state: RootState, perioder: OppfolgingsPeriode[]) => ({
        status: Status.OK,
        data: {
            ...state.data.oppfolging.data!,
            oppfolgingsPerioder: perioder,
        },
    }),
    utdatertIKrr: (state: RootState) => ({
        status: Status.OK,
        data: {
            ...state.data.oppfolging.data!,
            brukerStatus: {
                ...state.data.oppfolging.data!.brukerStatus,
                manuell: {
                    erManuell: false,
                },
                krr: {
                    registrertIKrr: true,
                    reservertIKrr: false,
                    kanVarsles: false,
                },
            },
        },
    }),
    ikkeRegistrertIKrr: (state: RootState) => {
        return {
            status: Status.OK,
            data: {
                ...state.data.oppfolging.data!,
                brukerStatus: {
                    ...state.data.oppfolging.data!.brukerStatus,
                    manuell: {
                        erManuell: false,
                    },
                    krr: {
                        registrertIKrr: false,
                        reservertIKrr: false,
                        kanVarsles: true,
                    },
                },
            },
        };
    },
    reserverIKrr: (state: RootState) => {
        return {
            status: Status.OK,
            data: {
                ...state.data.oppfolging.data!,
                brukerStatus: {
                    ...state.data.oppfolging.data!.brukerStatus,
                    manuell: {
                        erManuell: false,
                    },
                    krr: {
                        registrertIKrr: true,
                        reservertIKrr: true,
                        kanVarsles: true,
                    },
                },
            },
        };
    },
    manuell: (state: RootState) => {
        return {
            status: Status.OK,
            data: {
                ...state.data.oppfolging.data!,
                brukerStatus: {
                    ...state.data.oppfolging.data!.brukerStatus,
                    manuell: {
                        erManuell: true,
                    },
                    krr: {
                        registrertIKrr: true,
                        reservertIKrr: false,
                        kanVarsles: true,
                    },
                },
            },
        };
    },
    medKvpAktivPeriode: (state: RootState) => ({
        status: Status.OK,
        data: {
            ...state.data.oppfolging.data!,
            oppfolgingsPerioder: [
                {
                    ...aktivVeilarbOppfolgingMockPeriode,
                    kvpPerioder: [
                        {
                            startTidspunkt: aktivVeilarbOppfolgingMockPeriode.startTidspunkt,
                            sluttTidspunkt: undefined,
                        },
                    ],
                    // kvpPerioder,
                },
            ],
        },
    }),
};
