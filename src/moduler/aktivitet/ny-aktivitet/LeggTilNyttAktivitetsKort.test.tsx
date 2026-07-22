import { describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ErVeilederContext } from '../../../Provider';
import LeggTilNyttAktivitetsKort from './LeggTilNyttAktivitetsKort';
import { WrappedComponent } from '../../../testUtils/WrappedHovedside';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../../store/rootReducer';
import { hovedsideRoute } from '../../../routing/useRoutes';

const emptyStore = {};
const initialStore = {};
const store = configureStore({ reducer: rootReducer, preloadedState: initialStore as any });
const erVeileder = true;

describe('LeggTilNyttAktivitetsKort', () => {
    it('Legg til aktivitet knapp skal være disabled før data har lastet inn', () => {
        const empty = configureStore({ reducer: rootReducer, preloadedState: emptyStore as any });
        const { queryByRole } = render(
            <WrappedComponent initialEntries={[hovedsideRoute(erVeileder)]} store={empty}>
                <ErVeilederContext.Provider value={erVeileder}>
                    <LeggTilNyttAktivitetsKort />
                </ErVeilederContext.Provider>
            </WrappedComponent>,
        );
        const button = queryByRole('button', { name: 'Legg til aktivitet' });
        expect(button).toBeDisabled();
    });

    it('Legg til aktivitet knapp skal være disabled før data har lastet inn', () => {
        const { queryByRole } = render(
            <WrappedComponent initialEntries={[hovedsideRoute(erVeileder)]} store={store}>
                <ErVeilederContext.Provider value={erVeileder}>
                    <LeggTilNyttAktivitetsKort />
                </ErVeilederContext.Provider>
            </WrappedComponent>,
        );
        const button = queryByRole('button', { name: 'Legg til aktivitet' });
        expect(button).toBeDisabled();
    });
});
