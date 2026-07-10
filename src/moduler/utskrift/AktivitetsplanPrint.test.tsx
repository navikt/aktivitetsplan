import { describe, expect } from 'vitest';
import { initialLoadedEmptyState } from '../../testUtils/defaultInitialStore';
import { RootState } from '../../store';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../reducer';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import AktivitetsplanPrint from './AktivitetsplanPrint';
import { render } from '@testing-library/react';
import { ErVeilederContext, FnrOgEnhetContext } from '../../Provider';
import { aktivPeriodeId } from '../../mocks/data/oppfolging';
import { Status } from '../../createGenericSlice';
import { OppfolgingsPeriode, OppfolgingStatusResponse } from '../../api/veilarboppfolging';
import { OppfolgingsPeriodeId } from '../../datatypes/brandedTypes';

const storeWithKvpPeriods = {
    data: {
        ...initialLoadedEmptyState.data,
        oppfolging: {
            status: Status.OK,
            data: {
                ...initialLoadedEmptyState.data.oppfolging.data!!,
                oppfolgingsPerioder: [
                    {
                        id: aktivPeriodeId,
                        sluttTidspunkt: null,
                        kvpPerioder: [
                            {
                                startTidspunkt: '2026-01-01T00:00:00Z',
                                sluttTidspunkt: undefined,
                            },
                        ],
                    } as OppfolgingsPeriode,
                ],
            } as OppfolgingStatusResponse,
        },
        valgtPeriode: {
            valgtPeriodeId: aktivPeriodeId,
        },
    },
} as RootState;

const storeWithoutKvpPeriods = {
    data: {
        ...initialLoadedEmptyState.data,
        oppfolging: {
            status: Status.OK,
            data: {
                ...initialLoadedEmptyState.data.oppfolging.data,
                oppfolgingsPerioder: [
                    {
                        id: '123' as OppfolgingsPeriodeId,
                        sluttTidspunkt: undefined,
                        kvpPerioder: [],
                    },
                ],
            } as OppfolgingStatusResponse,
        },
    },
} as unknown as RootState;

const lagStore = (initialStore: RootState) => {
    return configureStore({
        reducer,
        preloadedState: initialStore,
    });
};

const AktivitetsvisningModalWrapped = (props: { store: any }) => (
    <div id={'app'}>
        <MemoryRouter initialEntries={[`/utskrift/${aktivPeriodeId}`]}>
            <Routes>
                <Route
                    path={`/utskrift/:oppfolgingsperiodeId`}
                    element={
                        <ErVeilederContext.Provider value={true}>
                            <FnrOgEnhetContext.Provider value={{ aktivEnhet: '2121', fnr: '1231231231' }}>
                                <Provider store={props.store}>
                                    <AktivitetsplanPrint />
                                </Provider>
                            </FnrOgEnhetContext.Provider>
                        </ErVeilederContext.Provider>
                    }
                ></Route>
            </Routes>
        </MemoryRouter>
    </div>
);

describe('AktivitetsplanPrint.tsx', () => {
    it('veileder: skal vise velg kvp modal hvis bruker har kvp-perioder', () => {
        const { getAllByText } = render(<AktivitetsvisningModalWrapped store={lagStore(storeWithKvpPeriods)} />);
        expect(getAllByText('Velg hva du ønsker å skrive ut')).toHaveLength(2);
    });

    it('veileder: skal ikke vise velg kvp modal hvis bruker ikke har kvp-perioder', () => {
        const { queryByText } = render(<AktivitetsvisningModalWrapped store={lagStore(storeWithoutKvpPeriods)} />);
        expect(queryByText('Velg hva du ønsker å skrive ut')).not.toBeInTheDocument();
    });
});
