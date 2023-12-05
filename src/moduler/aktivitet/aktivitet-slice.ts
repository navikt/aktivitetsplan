import { createSlice, isAnyOf } from '@reduxjs/toolkit';

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

export interface AktivitetState {
    data: {
        perioder: PerioderMedAktiviteter[];
    };
    status: Status;
}

type PerioderMedAktiviteter = {
    id: string;
    aktiviteter: VeilarbAktivitet[];
};

const initialState: AktivitetState = {
    data: { perioder: [] },
    status: Status.NOT_STARTED,
};

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

const aktivitetSlice = createSlice({
    name: 'aktivitet',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentAktiviteter.fulfilled, (state, action) => {
            state.status = Status.OK;
            state.data = action.payload.data;
        });
        builder.addCase(hentAktivitet.fulfilled, (state, action) => {
            return {
                ...nyStateMedOppdatertAktivitet(state, action.payload),
                status: Status.OK,
            };
        });
        builder.addCase(lagNyAktivitet.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            const oppfolgingsperiode = action.payload.oppfolgingsperiodeId;
            const perioderMedFallback = (perioder: PerioderMedAktiviteter[]) => {
                if (!perioder?.length)
                    return [
                        {
                            id: oppfolgingsperiode,
                            aktiviteter: [],
                        },
                    ];
                return perioder;
            };

            return {
                status: Status.OK,
                data: {
                    perioder: perioderMedFallback(state.data.perioder).map((periode) => {
                        return {
                            ...periode,
                            aktiviteter:
                                periode.id === action.payload.oppfolgingsperiodeId
                                    ? [...periode.aktiviteter, action.payload]
                                    : periode.aktiviteter,
                        };
                    }),
                },
            };
        });
        builder.addCase(markerForhaandsorienteringSomLest.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet(state, action.payload);
        });
        builder.addCase(settAktivitetTilAvtalt.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet(state, action.payload);
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
