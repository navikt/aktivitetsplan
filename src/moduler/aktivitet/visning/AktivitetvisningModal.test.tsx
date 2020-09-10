import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import AktivitetvisningModal from './aktivitetvisning-modal';
import { HENTING_FEILET as DIALOG_HENT_FEILET } from '../../dialog/dialog-reducer';
import { BrowserRouter as Router } from 'react-router-dom';
import Feilmelding from '../../feilmelding/Feilmelding';
import create from '../../../store';

const dialogFeilet = () => ({ type: DIALOG_HENT_FEILET, data: {} });

const hi = {
    goBack: () => {},
    push: () => {},
    replace: () => {},
};

const AktivitetsvisningModalWrapped = (props: { store: any }) => (
    <Router>
        <Provider store={props.store}>
            <AktivitetvisningModal avhengigheter={[]} history={hi}>
                <div />
            </AktivitetvisningModal>
        </Provider>
    </Router>
);

describe('<AktivitetvisningModal/>', () => {
    it('Skal ikke vise feilmelding dersom dialog ikke feiler', () => {
        const store = create();
        const wrapper = mount(<AktivitetsvisningModalWrapped store={store} />);

        expect(wrapper.find(Feilmelding).html()).toBeNull();
    });

    it('Skal vise feilmelding dersom dialog feiler', () => {
        const store = create();

        store.dispatch(dialogFeilet());

        const wrapper = mount(<AktivitetsvisningModalWrapped store={store} />);
        expect(wrapper.find(Feilmelding).html()).not.toBeNull();
    });
});
