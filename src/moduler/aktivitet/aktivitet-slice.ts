import { createEntityAdapter, createSlice, EntityState, isAnyOf, createSelector } from '@reduxjs/toolkit';

import { Status } from '../../createGenericSlice';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { UpdateTypes, windowEvent } from '../../utils/UpdateHandler';
import {
    flyttAktivitet,
    hentAktivitet,
    hentAktiviteter,
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
import { lastAltPaaNyttMedNyBruker } from '../../api/modiaContextHolder';
import { loggDyplenkingTilAnnenBruker } from '../../analytics/umami.client';

type PerioderMedAktiviteter = {
    id: string;
    aktiviteter: VeilarbAktivitet[];
};

export interface PeriodeEntityState {
    id: string;
    aktiviteter: EntityState<VeilarbAktivitet>;
    start: string;
    slutt: string | undefined | null;
}

export const aktivitetAdapter = createEntityAdapter<VeilarbAktivitet>({
    selectId: (model) => model.id,
});
export const oppfolgingsdperiodeAdapter = createEntityAdapter<PeriodeEntityState>({
    selectId: (model) => model.id,
});

export const { selectById: selectOppfolgingsperiodeById, selectAll: selectAllOppfolgingsperioder } =
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
        const oppfolgingsperioder = selectAllOppfolgingsperioder(aktiviteter);
        return (oppfolgingsperioder || []).map((periode) => ({
            id: periode.id,
            aktiviteter: selectAlleAktiviter(periode.aktiviteter),
        }));
    },
);

const initialState = oppfolgingsdperiodeAdapter.getInitialState({
    status: Status.NOT_STARTED,
});

export type AktivitetState = typeof initialState;

function nyStateMedOppdatertAktivitet(state: AktivitetState, aktivitet: VeilarbAktivitet): AktivitetState {
    const oppfolgingsperiode = getOrCreatePeriode(state, aktivitet.oppfolgingsperiodeId);
    return oppfolgingsdperiodeAdapter.upsertOne(state, {
        id: oppfolgingsperiode.id,
        aktiviteter: aktivitetAdapter.upsertOne(oppfolgingsperiode.aktiviteter, aktivitet),
        start: oppfolgingsperiode.start,
        slutt: oppfolgingsperiode.slutt,
    });
}

// Exported only for testing setup
export const getOrCreatePeriode = (state: typeof initialState, oppfolgingsperiodeId: string): PeriodeEntityState => {
    return (
        selectOppfolgingsperiodeById(state, oppfolgingsperiodeId) || {
            // Hvis ingen oppfølgingsperiode funnet, opprett en ny
            id: oppfolgingsperiodeId,
            aktiviteter: aktivitetAdapter.getInitialState(),
            start: 'NaN',
            slutt: undefined,
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
                    aktiviteter: aktivitetAdapter.upsertMany(periodeState.aktiviteter, periode.aktiviteter),
                    start: periode.start,
                    slutt: periode.slutt,
                };
            });
            oppfolgingsdperiodeAdapter.upsertMany(state, oppfolgingsperioder);
        });
        builder.addCase(hentAktivitet.fulfilled, (state, action) => {
            const aktivitet = action.payload.data.aktivitet;
            const eier = action.payload.data.eier;
            const aktivitetIDer = selectAllOppfolgingsperioder(state)
                .map((periode) => selectAlleAktiviter(periode.aktiviteter).map((aktivitet) => aktivitet.id))
                .flat();

            const aktivitetTilhorerBrukerIContext = !aktivitetIDer.includes(aktivitet.id);

            if (aktivitetTilhorerBrukerIContext) {
                loggDyplenkingTilAnnenBruker();
                lastAltPaaNyttMedNyBruker(eier.fnr);
            }

            nyStateMedOppdatertAktivitet(state, aktivitet);
        });
        builder.addCase(lagNyAktivitet.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            nyStateMedOppdatertAktivitet(state, action.payload);
        });
        builder.addCase(markerForhaandsorienteringSomLest.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            nyStateMedOppdatertAktivitet(state, action.payload);
        });
        builder.addCase(settAktivitetTilAvtalt.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            nyStateMedOppdatertAktivitet(state, action.payload);
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
        builder.addMatcher(isAnyOf(hentAktiviteter.rejected, hentAktivitet.rejected), (state) => {
            state.status = Status.ERROR;
        });
    },
});

export default aktivitetSlice.reducer;
