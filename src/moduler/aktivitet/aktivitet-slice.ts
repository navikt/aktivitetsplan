import { createEntityAdapter, createSlice, EntityState, isAnyOf } from '@reduxjs/toolkit';

import { produce } from 'immer';
import { Status } from '../../createGenericSlice';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { UpdateTypes, windowEvent } from '../../utils/UpdateHandler';
import {
    flyttAktivitet,
    hentAktivitet,
    hentAktiviteter,
    hentAktivitetMedHistorikk,
    lagNyAktivitet,
    markerForhaandsorienteringSomLest,
    oppdaterAktivitetEtikett,
    oppdaterCVSvar,
    oppdaterReferat,
    oppdaterStillingFraNavSoknadsstatus,
    publiserReferat,
    settAktivitetTilAvtalt,
} from './aktivitet-actions';
import { RootState } from '../../store';
import { createSelector } from 'reselect';

export type AktivitetState = {
    // data: {
    //     perioder: EntityState<{ id: string; aktiviteter: EntityState<VeilarbAktivitet> }>;
    // };
    status: Status;
    // ids: string[];
    // entities: EntityState<{ id: string; aktiviteter: EntityState<VeilarbAktivitet> }>;
} & EntityState<{ id: string; aktiviteter: EntityState<VeilarbAktivitet> }>;

type PerioderMedAktiviteter = {
    id: string;
    aktiviteter: VeilarbAktivitet[];
};

const aktivitetAdapter = createEntityAdapter<VeilarbAktivitet>({
    selectId: (model) => model.id,
});
const oppfolgingsdperiodeAdapter = createEntityAdapter<{ id: string; aktiviteter: EntityState<VeilarbAktivitet> }>({
    selectId: (model) => model.id,
});
const { selectById: selectOppfolgingsperiodeById, selectAll: selectAllOppfolgingsperioder } =
    oppfolgingsdperiodeAdapter.getSelectors();
const { selectById: selectAktivitetById, selectAll: selectAlleAktiviter } = aktivitetAdapter.getSelectors();

export const selectAktiviteterSlice = (state: RootState): AktivitetState => state.data.aktiviteter;
export const selectAktivitet = (state: RootState, aktivitetId: string): VeilarbAktivitet | undefined => {
    const perioder = selectAllOppfolgingsperioder(selectAktiviteterSlice(state));
    return perioder
        .map((periode) => selectAktivitetById(periode.aktiviteter, aktivitetId))
        .find((aktivitet) => !!aktivitet);
};
export const selectAktiviteterData: (state: RootState) => VeilarbAktivitet[] = createSelector(
    selectAktiviteterSlice,
    (aktiviteter) => {
        // TODO: Find out why this returns [undefined] in one of the tests
        return (
            selectAllOppfolgingsperioder(aktiviteter)
                .flatMap((periode) => selectAlleAktiviter(periode.aktiviteter))
                .filter((it) => it) || []
        );
    },
);
export const selectAktiviteterByPeriode: (state: RootState) => PerioderMedAktiviteter[] = createSelector(
    selectAktiviteterSlice,
    (aktiviteter) => {
        return selectAllOppfolgingsperioder(aktiviteter).map((periode) => ({
            id: periode.id,
            aktiviteter: selectAlleAktiviter(periode.aktiviteter),
        }));
    },
);

const initialState = oppfolgingsdperiodeAdapter.getInitialState({
    data: { perioder: [] },
    status: Status.NOT_STARTED,
});

function nyStateMedOppdatertAktivitet(state: AktivitetState, aktivitet: VeilarbAktivitet): AktivitetState {
    return {
        ...state,
        data: {
            perioder: state.data.perioder.map((periode) => {
                return {
                    ...periode,
                    aktiviteter: periode.aktiviteter.map((a) => {
                        return a.id === aktivitet.id ? aktivitet : a;
                    }),
                };
            }),
        },
    };
}

const getOrCreatePeriode = (state: typeof initialState, oppfolgingsperiodeId: string) => {
    return (
        selectOppfolgingsperiodeById(state, oppfolgingsperiodeId) || {
            // Hvis ingen oppfølgingsperiode funnet, opprett en ny
            id: oppfolgingsperiodeId,
            aktiviteter: aktivitetAdapter.getInitialState(),
        }
    );
};

const aktivitetSlice = createSlice({
    name: 'aktivitet',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentAktiviteter.fulfilled, (state, action) => {
            state.status = Status.OK;
            const oppfolgingsperioder = action.payload.data.perioder.map((periode) => {
                const periodeState = getOrCreatePeriode(state, periode.id);
                return {
                    id: periode.id,
                    aktiviteter: aktivitetAdapter.setAll(periodeState.aktiviteter, periode.aktiviteter),
                };
            });
            oppfolgingsdperiodeAdapter.upsertMany(state, oppfolgingsperioder);
        });
        builder.addCase(hentAktivitet.fulfilled, (state, action) => {
            const aktivitet = action.payload;
            const oppfolgingsperiode = getOrCreatePeriode(state, aktivitet.oppfolgingsperiodeId);
            aktivitetAdapter.upsertOne(oppfolgingsperiode.aktiviteter, aktivitet);
            oppfolgingsdperiodeAdapter.upsertOne(state, oppfolgingsperiode);
        });
        builder.addCase(hentAktivitetMedHistorikk.fulfilled, (state, action) => {
            const aktivitet = action.payload.data.aktivitet;
            const oppfolgingsperiode = getOrCreatePeriode(state, aktivitet.oppfolgingsperiodeId);
            oppfolgingsperiode.aktiviteter = aktivitetAdapter.upsertOne(oppfolgingsperiode.aktiviteter, aktivitet);
            console.log({ oppfolgingsperiode });
            // ok
            const perioder = oppfolgingsdperiodeAdapter.upsertOne(state, oppfolgingsperiode);
            console.log(perioder.entities[oppfolgingsperiode.id]);
        });
        builder.addCase(lagNyAktivitet.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            const periode = getOrCreatePeriode(state, action.payload.oppfolgingsperiodeId);
            aktivitetAdapter.upsertOne(periode.aktiviteter, action.payload);
            oppfolgingsdperiodeAdapter.upsertOne(state, periode);
        });
        builder.addCase(markerForhaandsorienteringSomLest.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            const aktivitet = action.payload;
            const oppfolgingsperiode = getOrCreatePeriode(state, aktivitet.oppfolgingsperiodeId);
            aktivitetAdapter.upsertOne(oppfolgingsperiode.aktiviteter, aktivitet);
            oppfolgingsdperiodeAdapter.upsertOne(state, oppfolgingsperiode);
        });
        builder.addCase(settAktivitetTilAvtalt.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            const aktivitet = action.payload.data.aktivitet;
            const oppfolgingsperiode = getOrCreatePeriode(state, aktivitet.oppfolgingsperiodeId);
            aktivitetAdapter.upsertOne(oppfolgingsperiode.aktiviteter, aktivitet);
            oppfolgingsdperiodeAdapter.upsertOne(state, oppfolgingsperiode);
        });
        builder.addMatcher(
            isAnyOf(
                oppdaterCVSvar.fulfilled,
                oppdaterAktivitetEtikett.fulfilled,
                oppdaterStillingFraNavSoknadsstatus.fulfilled,
            ),
            (state, action) => {
                return nyStateMedOppdatertAktivitet(state, action.payload);
            },
        );
        builder.addMatcher(
            isAnyOf(flyttAktivitet.fulfilled, oppdaterReferat.fulfilled, publiserReferat.fulfilled),
            (state, action) => {
                windowEvent(UpdateTypes.Aktivitet);
                return nyStateMedOppdatertAktivitet(state, action.payload);
            },
        );
        builder.addMatcher(
            isAnyOf(hentAktiviteter.rejected, hentAktivitet.rejected, hentAktivitetMedHistorikk.rejected),
            (state) => {
                state.status = Status.ERROR;
            },
        );
    },
});

export default aktivitetSlice.reducer;
