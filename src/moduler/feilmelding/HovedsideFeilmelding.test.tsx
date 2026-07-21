import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import rootReducer from '../../store/rootReducer';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { hentOppfolging } from '../oppfolging-status/oppfolging-slice';
import { getErrorText } from './Feilmelding';
import HovedsideFeilmelding from './HovedsideFeilmelding';

const error = {
    name: '500',
    message: 'backend must fix',
};

describe('<HovedsideFeilmelding/>', () => {
    it('Skal ikke rendre <Feilmelding/> dersom ingenting feiler', () => {
        const store = configureStore({ reducer: rootReducer });
        const { queryByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>,
        );
        expect(queryByText(getErrorText([{ type: hentDialoger.rejected.type }]))).toBeFalsy();
    });

    it('Skal rendre <Feilmelding/> dersom oppfølging feiler', () => {
        const store = configureStore({ reducer: rootReducer });
        store.dispatch(hentOppfolging.rejected(error, 'asd'));
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>,
        );
        getByText(getErrorText([{ type: hentOppfolging.rejected.type }]));
    });

    it('Skal rendre <Feilmelding/> dersom dialog feiler', () => {
        const store = configureStore({ reducer: rootReducer });

        store.dispatch(hentDialoger.rejected(error, 'asds'));
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>,
        );
        getByText(getErrorText([{ type: hentDialoger.rejected.type }]));
    });

    it('Skal rendre <Feilmelding/> dersom arena feiler', () => {
        const store = configureStore({ reducer: rootReducer });

        store.dispatch(hentArenaAktiviteter.rejected(error, 'asds'));
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>,
        );
        getByText(getErrorText([{ type: hentArenaAktiviteter.rejected.type }]));
    });
});
