import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import create from '../../../store';
import { HENTING_FEILET as DIALOG_HENT_FEILET } from '../../dialog/dialog-reducer';
import Feilmelding from '../../feilmelding/Feilmelding';
import AktivitetvisningModal from './AktivitetvisningModal';

const dialogFeilet = () => ({ type: DIALOG_HENT_FEILET, data: {} });

function Router(props: { children?: React.ReactNode }) {
    if (process.env.REACT_APP_USE_HASH_ROUTER === 'true') {
        return <HashRouter>{props.children}</HashRouter>;
    }
    return <BrowserRouter basename={process.env.PUBLIC_URL}>{props.children}</BrowserRouter>;
}

const AktivitetsvisningModalWrapped = (props: { store: any }) => (
    <Router>
        <Provider store={props.store}>
            <AktivitetvisningModal avhengigheter={[]}>
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
