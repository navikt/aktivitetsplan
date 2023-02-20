import { Modal } from '@navikt/ds-react';
import { mount } from 'enzyme';
import React from 'react';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import create from '../../../store';
import { HENTING_FEILET as DIALOG_HENT_FEILET } from '../../dialog/dialog-reducer';
import Feilmelding from '../../feilmelding/Feilmelding';
import AktivitetvisningModal from './AktivitetvisningModal';

const dialogFeilet = () => ({ type: DIALOG_HENT_FEILET, data: {} });

const AktivitetsvisningModalWrapped = (props: { store: any }) => (
    <div id={'app'}>
        <MemoryRouter>
            <Provider store={props.store}>
                <AktivitetvisningModal avhengigheter={[]}>
                    <div />
                </AktivitetvisningModal>
            </Provider>
        </MemoryRouter>
    </div>
);

// Hack to remove warnings from tests https://github.com/reactjs/react-modal/issues/632
Modal.setAppElement(document.createElement('div'));
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
