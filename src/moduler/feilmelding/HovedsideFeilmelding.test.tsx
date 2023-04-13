import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import reducer from '../../reducer';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { hentOppfolging } from '../oppfolging-status/oppfolging-slice';
import { tekster } from './GetErrorText';
import HovedsideFeilmelding from './HovedsideFeilmelding';

const error = {
    name: '500',
    message: 'backend must fix',
};

describe('<HovedsideFeilmelding/>', () => {
    it('Skal ikke rendre <Feilmelding/> dersom ingenting feiler', () => {
        const store = configureStore({ reducer });
        const { queryByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        expect(queryByText(tekster.fallback)).toBeFalsy();
    });

    it('Skal rendre <Feilmelding/> dersom oppfølging feiler', () => {
        const store = configureStore({ reducer });
        store.dispatch(hentOppfolging.rejected(error, 'asd'));
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        getByText(tekster.fallback);
    });

    it('Skal rendre <Feilmelding/> dersom dialog feiler', () => {
        const store = configureStore({ reducer });

        store.dispatch(hentDialoger.rejected(error, 'asds'));
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        getByText(tekster.dialogFeilet);
    });

    it('Skal rendre <Feilmelding/> dersom arena feiler', () => {
        const store = configureStore({ reducer });

        store.dispatch(hentArenaAktiviteter.rejected(error, 'asds'));
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        getByText(tekster.aktivitetFeilet);
    });
});
