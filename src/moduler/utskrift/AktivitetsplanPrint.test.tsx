import { describe, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import AktivitetsplanPrint from './AktivitetsplanPrint';
import { render } from '@testing-library/react';
import { ErVeilederContext, FnrOgEnhetContext } from '../../Provider';
import { aktivPeriodeId } from '../../mocks/data/oppfolging';
import { gitt } from '../../testUtils/store/mockStoreBuilder';

const AktivitetsvisningModalWrapped = (props: { store: any }) => (
    <div id={'app'}>
        <MemoryRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            initialEntries={[`/utskrift/${aktivPeriodeId}`]}
        >
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
