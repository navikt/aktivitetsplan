import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from '../../reducer';
import { HENTING_FEILET as ARENA_HENT_FEILET } from '../aktivitet/arena-aktiviteter-reducer';
import { HENTING_FEILET as DIALOG_HENT_FEILET } from '../dialog/dialog-reducer';
import { fetchOppfolging } from '../oppfolging-status/oppfolging-slice';
import Feilmelding from './Feilmelding';
import { tekster } from './GetErrorText';
import HovedsideFeilmelding from './HovedsideFeilmelding';

const oppfFeilet = () => ({ type: [fetchOppfolging.rejected], data: {} });
const dialogFeilet = () => ({ type: DIALOG_HENT_FEILET, data: { type: DIALOG_HENT_FEILET } });
const arenaFeilet = () => ({ type: ARENA_HENT_FEILET, data: {} });

describe('<HovedsideFeilmelding/>', () => {
    it('Skal ikke rendre <Feilmelding/> dersom ingenting feiler', () => {
        const store = createStore(reducer);

        const wrapper = mount(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        expect(wrapper.find(Feilmelding).html()).toBeNull();
    });

    it('Skal rendre <Feilmelding/> dersom oppfølging feiler', () => {
        const store = createStore(reducer);

        store.dispatch(oppfFeilet());
        const wrapper = mount(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        expect(wrapper.find(Feilmelding)).not.toBeNull();
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
        const wrapper = mount(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        const feilmelding = wrapper.find(Feilmelding);

        expect(feilmelding.length).toEqual(1);
    });
});
