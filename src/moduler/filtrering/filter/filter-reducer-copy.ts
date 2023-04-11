import { HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';

const initalState = {
    aktivitetTyper: {},
    aktivitetEtiketter: {},
    arenaAktivitetEtiketter: {},
    aktivitetStatus: {},
    aktivitetAvtaltMedNav: {},
    historiskPeriode: null,
};

enum FilterActionType {
    TOGGLE_AKTIVITET_TYPE = 'filter/toggleAktivitetType',
    TOGGLE_AKTIVITET_ETIKETT = 'filter/toggleAktivitetEtikett',
    TOGGLE_ARENA_AKTIVITET_ETIKETT = 'filter/toggleArenaAktivitetEtikett',
    VELG_HISTORISK_PERIODE = 'filter/velg',
    TOGGLE_AKTIVITET_STATUS = 'filter/toggleAktivitetStatus',
    TOGGLE_AKTIVITET_AVTALT = 'filter/toggleAktivitetAvtaltMedNav',
}

interface Action {
    type: FilterActionType;
    data: any;
}

const reducer = (state: any = initalState, action: Action) => {
    const { type, data } = action;
    switch (type) {
        case FilterActionType.TOGGLE_AKTIVITET_TYPE: {
            const aktivitetTyper = { ...state.aktivitetTyper };
            aktivitetTyper[data] = !aktivitetTyper[data];
            return { ...state, aktivitetTyper };
        }
        case FilterActionType.TOGGLE_AKTIVITET_ETIKETT: {
            const aktivitetEtiketter = { ...state.aktivitetEtiketter };
            aktivitetEtiketter[data] = !aktivitetEtiketter[data];
            return { ...state, aktivitetEtiketter };
        }
        case FilterActionType.TOGGLE_ARENA_AKTIVITET_ETIKETT: {
            const arenaAktivitetEtiketter = { ...state.arenaAktivitetEtiketter };
            arenaAktivitetEtiketter[data] = !arenaAktivitetEtiketter[data];
            return { ...state, arenaAktivitetEtiketter };
        }
        case FilterActionType.TOGGLE_AKTIVITET_STATUS: {
            const aktivitetStatus = { ...state.aktivitetStatus };
            aktivitetStatus[data] = !aktivitetStatus[data];
            return { ...state, aktivitetStatus };
        }
        case FilterActionType.TOGGLE_AKTIVITET_AVTALT: {
            const aktivitetAvtaltMedNav = { ...state.aktivitetAvtaltMedNav };
            aktivitetAvtaltMedNav[data] = !aktivitetAvtaltMedNav[data];
            return { ...state, aktivitetAvtaltMedNav };
        }
        case FilterActionType.VELG_HISTORISK_PERIODE:
            return {
                ...initalState,
                historiskPeriode: data,
            };
        default:
            return state;
    }
};

export function toggleAktivitetsType(aktivitetType: any) {
    return {
        type: FilterActionType.TOGGLE_AKTIVITET_TYPE,
        data: aktivitetType,
    };
}

export function toggleAktivitetsEtikett(aktivitetEtikett: any) {
    return {
        type: FilterActionType.TOGGLE_AKTIVITET_ETIKETT,
        data: aktivitetEtikett,
    };
}
export function toggleArenaAktivitetsEtikett(arenaAktivitetEtiketter: any) {
    return {
        type: FilterActionType.TOGGLE_ARENA_AKTIVITET_ETIKETT,
        data: arenaAktivitetEtiketter,
    };
}

export function velgHistoriskPeriode(historiskPeriode: HistoriskOppfolgingsperiode | null) {
    return {
        type: FilterActionType.VELG_HISTORISK_PERIODE,
        data: historiskPeriode,
    };
}

export function toggleAktivitetsStatus(aktivitetStatus: any) {
    return {
        type: FilterActionType.TOGGLE_AKTIVITET_STATUS,
        data: aktivitetStatus,
    };
}

export function toggleAktivitetAvtaltMedNav(aktivitetAvtalt: any) {
    return {
        type: FilterActionType.TOGGLE_AKTIVITET_AVTALT,
        data: aktivitetAvtalt,
    };
}

export default reducer;
