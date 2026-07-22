import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { Dialog } from '../datatypes/dialogTypes';
import { emptyHalfLoadedVeilederState, initialLoadedAktiviteterState } from './store/defaultInitialStore';
import { RootState } from '../store/rootReducer';
import { Status } from '../store/createGenericSlice';
import { ArenaAktivitet } from '../datatypes/arenaAktivitetTypes';
import { arenaMockAktiviteter } from '../mocks/data/arena';
import { OppfolgingStatusResponse } from '../api/veilarboppfolging';

export const mockLoadedStore = ({
    aktiviteter,
    arenaAktiviteter: arenaAktiviteterInput,
    dialoger,
    oppfolging,
}: {
    aktiviteter?: VeilarbAktivitet[];
    arenaAktiviteter?: ArenaAktivitet[];
    dialoger?: Dialog[];
    oppfolging?: OppfolgingStatusResponse;
}): RootState => {
    const arenaAktiviteter = arenaAktiviteterInput || arenaMockAktiviteter;
    const preloadedStore: RootState = {
        data: {
            ...emptyHalfLoadedVeilederState.data,
            ...(aktiviteter
                ? {
                      aktiviteter: initialLoadedAktiviteterState({
                          aktiviteter,
                      }),
                  }
                : {}),
            ...(dialoger
                ? {
                      dialoger: {
                          data: [],
                          status: Status.OK,
                          sistOppdatert: undefined,
                      },
                  }
                : {}),
            ...(oppfolging
                ? {
                      oppfolging: {
                          data: oppfolging,
                          status: Status.OK,
                      },
                  }
                : {}),
            ...(arenaAktiviteter
                ? {
                      arenaAktiviteter: {
                          data: arenaAktiviteter,
                          status: Status.OK,
                      },
                  }
                : {}),
        },
        view: {
            ...emptyHalfLoadedVeilederState.view,
        },
    };
    return preloadedStore;
};
