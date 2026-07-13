import { describe, expect } from 'vitest';
import { initialLoadedEmptyState } from '../../testUtils/store/defaultInitialStore';
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
import { gitt } from '../../testUtils/store/mockStoreBuilder';

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
        const store = gitt().oppfolging.medKvpAktivPeriode().createStore();
        const { getAllByText } = render(<AktivitetsvisningModalWrapped store={store} />);
        expect(getAllByText('Velg hva du ønsker å skrive ut')).toHaveLength(2);
    });

    it('veileder: skal ikke vise velg kvp modal hvis bruker ikke har kvp-perioder', () => {
        const storeUtenKvpPeriode = gitt().createStore();
        const { queryByText } = render(<AktivitetsvisningModalWrapped store={storeUtenKvpPeriode} />);
        expect(queryByText('Velg hva du ønsker å skrive ut')).not.toBeInTheDocument();
    });
});
