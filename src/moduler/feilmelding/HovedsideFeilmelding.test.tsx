import React from 'react';

import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from '../../reducer';

import HovedsideFeilmelding from './HovedsideFeilmelding';
import Feilmelding from './Feilmelding';
import { HENTING_FEILET as DIALOG_HENT_FEILET } from '../dialog/dialog-reducer';
import { HENTING_FEILET as ARENA_HENT_FEILET } from '../aktivitet/arena-aktiviteter-reducer';
import { FEILET as OPPFOLGING_FEILET } from '../oppfolging-status/oppfolging-reducer';

import { Normaltekst } from 'nav-frontend-typografi';
import { tekster } from './GetErrorText';

const oppfFeilet = () => ({ type: OPPFOLGING_FEILET, data: {} });
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
        const wrapper = mount(
            <Provider store={store}>
                <HovedsideFeilmelding />
            </Provider>
        );
        const feilmelding = wrapper.find(Feilmelding);
        const actualTekst = feilmelding.find(Normaltekst).text().trim();

        expect(feilmelding.length).toEqual(1);
        expect(actualTekst).toEqual(tekster.dialogFeilet);
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
