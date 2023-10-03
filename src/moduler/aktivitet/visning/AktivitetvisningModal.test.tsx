import { configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import reducer from '../../../reducer';
import { hentDialoger } from '../../dialog/dialog-slice';
import { getErrorText } from '../../feilmelding/Feilmelding';
import AktivitetvisningModal from './AktivitetvisningModal';

const AktivitetsvisningModalWrapped = (props: { store: ToolkitStore }) => (
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

describe('<AktivitetvisningModal/>', () => {
    it('Skal ikke vise feilmelding dersom dialog ikke feiler', () => {
        const store = configureStore({ reducer });
        const { queryByText } = render(<AktivitetsvisningModalWrapped store={store} />);
        expect(queryByText(getErrorText([{ type: hentDialoger.rejected.type }]))).toBeFalsy();
    });

    it('Skal vise feilmelding dersom dialog feiler', () => {
        const store = configureStore({ reducer });
        store.dispatch(hentDialoger.rejected({ name: 'asd', message: 'asds' }, 'asd'));
        const { getByText } = render(<AktivitetsvisningModalWrapped store={store} />);
        getByText(getErrorText([{ type: hentDialoger.rejected.type }]));
    });
});
