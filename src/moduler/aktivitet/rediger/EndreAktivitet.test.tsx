import React from 'react';
import { describe, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { emptyLoadedVeilederState } from '../../../testUtils/defaultInitialStore';
import { WrappedComponent } from '../../../testUtils/WrappedHovedside';
import EndreAktivitet from './EndreAktivitet';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../../reducer';
import { Status } from '../../../createGenericSlice';
import { enMoteAktivitet } from '../../../mocks/fixtures/moteAktivitetFixtures';
import { endreAktivitetRoute } from '../../../routes';

const moteAktivitet = enMoteAktivitet();

const initialStore = {
    data: {
        ...emptyLoadedVeilederState.data,
        aktiviteter: {
            status: Status.OK,
            data: {
                perioder: [
                    {
                        id: '1',
                        aktiviteter: [moteAktivitet],
                    },
                ],
            },
        },
    },
};

describe('EndreAktivitet', async () => {
    it('endre aktivitet skal gi ny versjon', () => {
        const store = configureStore({ reducer, preloadedState: initialStore as any });
        const { getByLabelText } = render(
            <WrappedComponent initialEntries={[endreAktivitetRoute(moteAktivitet.id)]} store={store}>
                <EndreAktivitet />
            </WrappedComponent>,
        );
        fireEvent.click(getByLabelText('Tema for møtet (obligatorisk)'));
    });
});
