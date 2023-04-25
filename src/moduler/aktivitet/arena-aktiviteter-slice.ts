import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as Api from '../../api/aktivitetAPI';
import { Status } from '../../createGenericSlice';
import { ArenaAktivitet } from '../../datatypes/arenaAktivitetTypes';
import { Forhaandsorientering } from '../../datatypes/forhaandsorienteringTypes';
import { UpdateTypes, windowEvent } from '../../utils/UpdateHandler';

interface ArenaAktivitetState {
    data: ArenaAktivitet[];
    status: Status;
}

const initialState: ArenaAktivitetState = {
    data: [],
    status: Status.NOT_STARTED,
};

const nyStateMedOppdatertAktivitet = (state: ArenaAktivitetState, aktivitet: ArenaAktivitet) => {
    const aktivitetIndex = state.data.findIndex((a: ArenaAktivitet) => a.id === aktivitet.id);
    const nyState = [...state.data];
    nyState[aktivitetIndex] = aktivitet;
    return { ...state, data: nyState };
};

const arenaAktivitetSlice = createSlice({
    name: 'arenaAktivitet',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentArenaAktiviteter.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = Status.OK;
        });
        builder.addCase(hentArenaAktiviteter.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(sendForhaandsorienteringArenaAktivitet.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state }, action.payload);
        });
        builder.addCase(markerForhaandsorienteringSomLestArenaAktivitet.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state }, action.payload);
        });
    },
});

export const hentArenaAktiviteter = createAsyncThunk(`${arenaAktivitetSlice.name}/fetchArenaAktiviteter`, async () => {
    return await Api.hentArenaAktiviteter();
});

export const sendForhaandsorienteringArenaAktivitet = createAsyncThunk(
    `${arenaAktivitetSlice.name}/oppdater`,
    async ({
        arenaAktivitet,
        forhaandsorientering,
    }: {
        arenaAktivitet: ArenaAktivitet;
        forhaandsorientering: Forhaandsorientering;
    }) => {
        return await Api.sendForhaandsorienteringArenaAktivitet(arenaAktivitet.id, forhaandsorientering);
    }
);

export const markerForhaandsorienteringSomLestArenaAktivitet = createAsyncThunk(
    `${arenaAktivitetSlice.name}/fho/lest`,
    async (arenaAktivitet: ArenaAktivitet) => {
        return await Api.markerForhaandsorienteringSomLestArenaAktivitet(arenaAktivitet.id);
    }
);

export default arenaAktivitetSlice.reducer;