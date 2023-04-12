import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from '../../reducer';
import { HENTING_FEILET as ARENA_HENT_FEILET } from '../aktivitet/arena-aktiviteter-reducer';
import { HENTING_FEILET as DIALOG_HENT_FEILET } from '../dialog/dialog-reducer';
import { FEILET as OPPFOLGING_FEILET } from '../oppfolging-status/oppfolging-reducer';
import { tekster } from './GetErrorText';
import HovedsideFeilmelding from './HovedsideFeilmelding';

const oppfFeilet = () => ({ type: OPPFOLGING_FEILET, data: {} });
const dialogFeilet = () => ({ type: DIALOG_HENT_FEILET, data: { type: DIALOG_HENT_FEILET } });
const arenaFeilet = () => ({ type: ARENA_HENT_FEILET, data: {} });

describe('<HovedsideFeilmelding/>', () => {
    it('Skal ikke rendre <Feilmelding/> dersom ingenting feiler', () => {
        const store = createStore(reducer);

        const { queryByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        expect(queryByText('feil')).toBeFalsy();
    });

    it('Skal rendre <Feilmelding/> dersom oppfølging feiler', () => {
        const store = createStore(reducer);

        store.dispatch(oppfFeilet());
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        getByText('Noe gikk dessverre galt med aktivitetsplanen. Prøv igjen senere.');
    });

    it('Skal rendre <Feilmelding/> dersom dialog feiler', () => {
        const store = createStore(reducer);

        store.dispatch(dialogFeilet());
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        getByText(tekster.dialogFeilet);
    });

    it('Skal rendre <Feilmelding/> dersom arena feiler', () => {
        const store = createStore(reducer);

        store.dispatch(arenaFeilet());
        const { getByText } = render(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        getByText('Noe gikk dessverre galt med aktivitetsplanen. Prøv igjen senere.');
    });
});
