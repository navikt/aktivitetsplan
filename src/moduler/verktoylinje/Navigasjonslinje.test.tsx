import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import { ErVeilederContext } from '../../Provider';
import { gitt } from '../../testUtils/store/mockStoreBuilder';
import { Status } from '../../store/createGenericSlice';
import { selectKanAvslutteOppfolging } from '../oppfolging-status/oppfolging-selector';
import Navigasjonslinje from './Navigasjonslinje';

const feature = vi.hoisted(() => {
    vi.stubEnv('VITE_AVSLUTT_OPPFOLGING_URL', 'https://start-arbeidsoppfolging.ekstern.dev.nav.no/avslutt-oppfolging');
    return { aktiv: true };
});
vi.mock('../feature/feature', () => ({ useToggle: () => feature.aktiv }));

afterAll(() => vi.unstubAllEnvs());

afterEach(() => {
    cleanup();
    feature.aktiv = true;
});

const lagStore = (verdi: boolean | null | undefined, status: Status = Status.OK) => {
    const state = gitt().createStore().getState();
    return gitt({
        ...state,
        data: {
            ...state.data,
            oppfolging: {
                status,
                data: {
                    ...state.data.oppfolging.data!,
                    oppfolging: {
                        ...state.data.oppfolging.data!.oppfolging,
                        kanAvslutteOppfolging: verdi,
                    },
                },
            },
        },
    }).createStore();
};

describe('lenke til avslutt oppfølging', () => {
    it.each([true, false, null, undefined])('viser lenken kun når backend svarer true (svar=%s)', (verdi) => {
        render(
            <Provider store={lagStore(verdi)}>
                <MemoryRouter>
                    <Navigasjonslinje />
                </MemoryRouter>
            </Provider>,
        );
        expect(!!screen.queryByRole('link', { name: 'Avslutt arbeidsrettet oppfølging' })).toBe(verdi === true);
        if (verdi === true) {
            expect(screen.getByRole('link', { name: 'Avslutt arbeidsrettet oppfølging' })).toHaveAttribute(
                'href',
                'https://start-arbeidsoppfolging.ekstern.dev.nav.no/avslutt-oppfolging',
            );
        }
    });

    it.each([
        { erVeileder: true, flagg: true },
        { erVeileder: false, flagg: false },
    ])('skjuler lenken for veileder eller avslått flagg (%j)', ({ erVeileder, flagg }) => {
        feature.aktiv = flagg;
        render(
            <Provider store={lagStore(true)}>
                <ErVeilederContext.Provider value={erVeileder}>
                    <MemoryRouter>
                        <Navigasjonslinje />
                    </MemoryRouter>
                </ErVeilederContext.Provider>
            </Provider>,
        );
        expect(screen.queryByRole('link', { name: 'Avslutt arbeidsrettet oppfølging' })).not.toBeInTheDocument();
    });

    it.each([Status.NOT_STARTED, Status.PENDING, Status.RELOADING, Status.ERROR])(
        'skjuler lenken når henting er %s',
        (status) => {
            expect(selectKanAvslutteOppfolging(lagStore(true, status).getState())).toBe(false);
        },
    );
});
