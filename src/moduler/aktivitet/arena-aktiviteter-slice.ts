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

const validArenaPrefixes = ['TA', 'UA', 'GA', 'ARENATA', 'ARENAUA', 'ARENAGA'];
const erArenaId = (id: string) => validArenaPrefixes.some((prefix) => id.startsWith(prefix));
export const sendForhaandsorienteringArenaAktivitet = createAsyncThunk(
    `${arenaAktivitetSlice.name}/oppdater`,
    async ({
        arenaAktivitet,
        forhaandsorientering,
    }: {
        arenaAktivitet: ArenaAktivitet;
        forhaandsorientering: Forhaandsorientering;
    }) => {
        if (erArenaId(arenaAktivitet.id)) {
            return await Api.sendForhaandsorienteringArenaAktivitet(arenaAktivitet.id, forhaandsorientering);
        } else {
            return await Api.settAktivitetTilAvtalt(
                arenaAktivitet.id,
                arenaAktivitet.versjon.toString(),
                forhaandsorientering,
            );
        }
    },
);

export const markerForhaandsorienteringSomLestArenaAktivitet = createAsyncThunk(
    `${arenaAktivitetSlice.name}/fho/lest`,
    async (arenaAktivitet: ArenaAktivitet) => {
        if (erArenaId(arenaAktivitet.id)) {
            return await Api.markerForhaandsorienteringSomLestArenaAktivitet(arenaAktivitet.id);
        } else {
            const oppdatertVeilarbAktivitet = await Api.markerForhaandsorienteringSomLest(
                arenaAktivitet.id,
                arenaAktivitet.versjon.toString(),
            );
            return {
                ...arenaAktivitet,
                forhaandsorientering: oppdatertVeilarbAktivitet.forhaandsorientering,
            };
        }
    },
);

export default arenaAktivitetSlice.reducer;
