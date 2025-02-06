import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { Dialog } from '../datatypes/dialogTypes';
import { OppfolgingStatus } from '../datatypes/oppfolgingTypes';
import { emptyHalfLoadedVeilederState, initialLoadedAktiviteterState } from './defaultInitialStore';
import { RootState } from '../store';
import { Status } from '../createGenericSlice';
import { ArenaAktivitet } from '../datatypes/arenaAktivitetTypes';
import { arenaMockAktiviteter } from '../mocks/data/arena';

export const mockLoadedStore = ({
    aktiviteter,
    arenaAktiviteter: arenaAktiviteterInput,
    dialoger,
    oppfolging,
}: {
    aktiviteter?: VeilarbAktivitet[];
    arenaAktiviteter?: ArenaAktivitet[];
    dialoger?: Dialog[];
    oppfolging?: OppfolgingStatus;
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
