import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Hovedside from '../hovedside/Hovedside';
import React from 'react';

/* Rendrer hele appen men med in-memory router og mulighet for å sette initial redux-state slik at
 * mesteparten av mock-data er på plass ved første render */
export const WrappedHovedside = ({ store }: { store: ToolkitStore }) => {
    return (
        <Provider store={store}>
            <MemoryRouter>
                <Hovedside />
            </MemoryRouter>
        </Provider>
    );
};
