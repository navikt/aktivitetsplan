import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import { AktivitetFilterType, ArenaEtikettFilterType, AvtaltFilterType, EtikettFilterType } from './FilterVisning';

export interface FilterState {
    aktivitetTyper: AktivitetFilterType;
    aktivitetEtiketter: EtikettFilterType;
    arenaAktivitetEtiketter: ArenaEtikettFilterType;
    aktivitetAvtaltMedNav: AvtaltFilterType;
    historiskPeriode: HistoriskOppfolgingsperiode | null;
}

const initialState: FilterState = {
    aktivitetTyper: {
        ARENA_TILTAK: false,
        BEHANDLING: false,
        EGEN: false,
        GRUPPEAKTIVITET: false,
        IJOBB: false,
        MIDLERTIDIG_LONNSTILSKUDD: false,
        MOTE: false,
        SAMTALEREFERAT: false,
        SOKEAVTALE: false,
        STILLING: false,
        STILLING_FRA_NAV: false,
        TILTAKSAKTIVITET: false,
        UTDANNINGSAKTIVITET: false,
        VARIG_LONNSTILSKUDD: false,
        ARBEIDSTRENING: false,
    },
    aktivitetEtiketter: {
        AVSLAG: false,
        CV_DELT: false,
        IKKE_FATT_JOBBEN: false,
        INGEN_VALGT: false,
        INNKALT_TIL_INTERVJU: false,
        JOBBTILBUD: false,
        SKAL_PAA_INTERVJU: false,
        SOKNAD_SENDT: false,
        VENTER: false,
    },
    arenaAktivitetEtiketter: {
        AKTUELL: false,
        AVSLAG: false,
        IKKAKTUELL: false,
        IKKEM: false,
        INFOMOETE: false,
        JATAKK: false,
        NEITAKK: false,
        TILBUD: false,
        VENTELISTE: false,
    },
    aktivitetAvtaltMedNav: {
        AVTALT_MED_NAV: false,
        IKKE_AVTALT_MED_NAV: false,
    },
    historiskPeriode: null,
};

const filterSlice = createSlice({
    name: 'filter',
    initialState: initialState,
    reducers: {
        toggleAktivitetsType: (state, action: PayloadAction<keyof AktivitetFilterType>) => {
            state.aktivitetTyper[action.payload] = !state.aktivitetTyper[action.payload];
        },
        toggleAktivitetsEtikett: (state, action: PayloadAction<keyof EtikettFilterType>) => {
            state.aktivitetEtiketter[action.payload] = !state.aktivitetEtiketter[action.payload];
        },
        toggleArenaAktivitetsEtikett: (state, action: PayloadAction<keyof ArenaEtikettFilterType>) => {
            state.arenaAktivitetEtiketter[action.payload] = !state.arenaAktivitetEtiketter[action.payload];
        },
        toggleAktivitetAvtaltMedNav: (state, action: PayloadAction<keyof AvtaltFilterType>) => {
            state.aktivitetAvtaltMedNav[action.payload] = !state.aktivitetAvtaltMedNav[action.payload];
        },
    },
});

export const {
    toggleAktivitetsEtikett,
    toggleArenaAktivitetsEtikett,
    toggleAktivitetsType,
    toggleAktivitetAvtaltMedNav,
} = filterSlice.actions;

export default filterSlice.reducer;
