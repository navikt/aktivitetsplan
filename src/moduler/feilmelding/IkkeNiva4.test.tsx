import {} from '../../api/utils';

import { configureStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { vi } from 'vitest';

import { Status } from '../../createGenericSlice';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';
import { loggHarBruktNivaa4, loggIkkeRegistrertIKrr } from '../../felles-komponenter/utils/logging';
import { mockfnr } from '../../index';
import { ErVeilederContext } from '../../Provider';
import reducer from '../../reducer';
import { RootState } from '../../store';
import { hentIdentitet } from '../identitet/identitet-slice';
import { hentOppfolging } from '../oppfolging-status/oppfolging-slice';
import { hentNivaa4 } from '../tilgang/tilgang-slice';
import IkkeNiva4 from './IkkeNiva4';

import MockedFn = jest.MockedFn;

const createMockStore = () =>
    configureStore({
        reducer: reducer,
        preloadedState: {
            data: {
                oppfolging: {
                    data: {},
                    status: Status.NOT_STARTED,
                },
                tilgang: {
                    data: {},
                    status: Status.NOT_STARTED,
                },
                identitet: {
                    data: {},
                    status: Status.NOT_STARTED,
                },
            },
        },
    });

const WrappedIkkeNiva4 = ({ store = createMockStore(), erVeileder }: { store: RootState; erVeileder: boolean }) => {
    return (
        <ErVeilederContext.Provider value={erVeileder}>
            <Provider store={store}>
                <IkkeNiva4 />
            </Provider>
        </ErVeilederContext.Provider>
    );
};

vi.mock('../../felles-komponenter/utils/logging', () => ({
    ...vi.importActual('../../felles-komponenter/utils/logging'),
    loggIkkeRegistrertIKrr: vi.fn(),
    loggHarBruktNivaa4: vi.fn(),
}));

const fetchData = (
    store: Store,
    {
        kanVarsles,
        erVeileder,
        reservasjonKRR,
        manuell,
    }: {
        kanVarsles: boolean;
        erVeileder: boolean;
        manuell: boolean;
        reservasjonKRR: boolean;
    }
) => {
    store.dispatch(
        hentNivaa4.fulfilled(
            {
                harbruktnivaa4: true,
                personidentifikator: mockfnr,
                erRegistrertIdPorten: true,
            },
            '12312',
            mockfnr
        )
    );
    store.dispatch(
        hentIdentitet.fulfilled(
            {
                erVeileder,
                erBruker: !erVeileder,
                id: mockfnr,
            },
            '1231'
        )
    );
    store.dispatch(
        hentOppfolging.fulfilled(
            {
                reservasjonKRR,
                manuell,
                kanVarsles,
                fnr: mockfnr,
            } as OppfolgingStatus,
            '4141'
        )
    );
};

describe('IkkeNiva4', () => {
    beforeEach(() => {
        (loggHarBruktNivaa4 as MockedFn<any>).mockClear();
        (loggIkkeRegistrertIKrr as MockedFn<any>).mockClear();
    });

    it('skal ikke logge ikkeRegIKrr når kan varsles && ikke manuell && ikke reservert i KRR', async () => {
        const store = createMockStore();
        render(<WrappedIkkeNiva4 erVeileder={true} store={store} />);
        fetchData(store, {
            kanVarsles: true,
            erVeileder: true,
            manuell: false,
            reservasjonKRR: false,
        });
        expect(loggHarBruktNivaa4).toHaveBeenCalledTimes(1);
        expect(loggIkkeRegistrertIKrr).not.toHaveBeenCalled();
    });

    it('skal logge både niva4 og ikkeRegIKrr når ikke kan varsles && ikke manuell && ikke reservert i KRR', async () => {
        const store = createMockStore();
        render(<WrappedIkkeNiva4 erVeileder={true} store={store} />);
        fetchData(store, {
            kanVarsles: false,
            erVeileder: true,
            manuell: false,
            reservasjonKRR: false,
        });
        expect(loggHarBruktNivaa4).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(loggIkkeRegistrertIKrr).toHaveBeenCalledTimes(1));
    });

    it('should not log when not veileder', async () => {
        const store = createMockStore();
        render(<WrappedIkkeNiva4 erVeileder={false} store={store} />);
        fetchData(store, {
            kanVarsles: true,
            erVeileder: false,
            manuell: false,
            reservasjonKRR: false,
        });
        expect(loggIkkeRegistrertIKrr).toHaveBeenCalledTimes(0);
    });
});
