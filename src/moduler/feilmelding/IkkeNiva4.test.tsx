import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, createStore } from 'redux';

import { STATUS } from '../../api/utils';
import { loggHarBruktNivaa4, loggIkkeRegistrertIKrr } from '../../felles-komponenter/utils/logging';
import reducer from '../../reducer';
import IkkeNiva4 from './IkkeNiva4';

import MockedFn = jest.MockedFn;

const createMockStore = () =>
    createStore(reducer, {
        data: {
            oppfolging: {
                data: {},
                status: STATUS.NOT_STARTED,
            },
            tilgang: {
                data: {},
                status: STATUS.NOT_STARTED,
            },
            identitet: {
                data: {},
                status: STATUS.NOT_STARTED,
            },
        },
    });

const WrappedIkkeNiva4 = ({ store = createMockStore() }) => {
    return (
        <Provider store={store}>
            <IkkeNiva4 />
        </Provider>
    );
};

jest.mock('../../felles-komponenter/utils/logging', () => ({
    ...jest.requireActual('../../felles-komponenter/utils/logging'),
    loggIkkeRegistrertIKrr: jest.fn(),
    loggHarBruktNivaa4: jest.fn(),
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
    store.dispatch({
        type: 'TILGANG/OK',
        data: {
            harbruktnivaa4: true,
            personidentifikator: { fnr: undefined },
        },
    });
    store.dispatch({
        type: 'IDENTITET/OK',
        data: {
            erVeileder,
        },
    });
    store.dispatch({
        type: 'oppfolging/OK',
        data: {
            reservasjonKRR,
            manuell,
            kanVarsles,
        },
    });
};

describe('IkkeNiva4', () => {
    beforeEach(() => {
        (loggHarBruktNivaa4 as MockedFn<any>).mockClear();
        (loggIkkeRegistrertIKrr as MockedFn<any>).mockClear();
    });

    it('skal ikke logge ikkeRegIKrr når kan varsles && ikke manuell && ikke reservert i KRR', async () => {
        const store = createMockStore();
        render(<WrappedIkkeNiva4 store={store} />);
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
        render(<WrappedIkkeNiva4 store={store} />);
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
        render(<WrappedIkkeNiva4 store={store} />);
        fetchData(store, {
            kanVarsles: true,
            erVeileder: false,
            manuell: false,
            reservasjonKRR: false,
        });
        expect(loggIkkeRegistrertIKrr).toHaveBeenCalledTimes(0);
    });
});
