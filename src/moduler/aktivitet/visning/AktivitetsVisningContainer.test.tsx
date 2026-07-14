import AktivitetvisningContainer from './AktivitetvisningContainer';
import { act, render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { gitt } from '../../../testUtils/store/mockStoreBuilder';
import { Provider } from 'react-redux';
import { RootState } from '../../../store';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ErVeilederContext } from '../../../Provider';
import { EnhancedStore } from '@reduxjs/toolkit/src/configureStore';
import { MoteAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { aktivVeilarbOppfolgingMockPeriode } from '../../../testUtils/store/defaultInitialStore';
import { AktivitetsId } from '../../../datatypes/brandedTypes';
import { addHours, subDays } from 'date-fns';

const aktivitetId = '1';
const aktivitet = {
    tittel: 'Aktivitet tittel',
    fraDato: subDays(new Date(), 8).toISOString(),
    tilDato: addHours(new Date(), 7).toISOString(),
    type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
    beskrivelse: 'Aktivitet beskrivelse',
    id: aktivitetId as AktivitetsId,
    oppfolgingsperiodeId: aktivVeilarbOppfolgingMockPeriode.id,
    avtalt: false,
} as unknown as MoteAktivitet;

const routing = createMemoryRouter(
    [
        {
            path: '/:id',
            loader: () => ({}),
            id: 'aktivitetsVisning',
            element: <AktivitetvisningContainer />,
        },
    ],
    {
        initialEntries: [`/${aktivitetId}`],
        future: {
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true,
        },
    },
);

const AktivitetsVisningContainerWrapper = ({
    store,
    erVeileder,
}: {
    store: EnhancedStore<RootState>;
    erVeileder: boolean;
}) => {
    return (
        <ErVeilederContext value={erVeileder}>
            <Provider store={store}>
                <RouterProvider future={{ v7_startTransition: true }} router={routing}></RouterProvider>
            </Provider>
        </ErVeilederContext>
    );
};

describe('Aktivitetsvisning', () => {
    it('skal vise beskrivelse til møte-aktivitet', () => {
        const store = gitt().aktiviteter.medAktivitet(aktivitet).createStore();
        const { getByText } = render(<AktivitetsVisningContainerWrapper store={store} erVeileder={true} />);
        getByText(aktivitet.beskrivelse!!);
    });

    it('skal advarsel på avtalt-med-nav form når bruker er under KVP', async () => {
        const store = gitt().aktiviteter.medAktivitet(aktivitet).oppfolging.medKvpAktivPeriode().createStore();
        const { getByText } = render(<AktivitetsVisningContainerWrapper store={store} erVeileder={true} />);
        await act(() => getByText('Avtalt med Nav').click());
        getByText('Du kan ikke legge til forhåndsorientering fordi brukeren deltar i kvalifiseringsprogrammet.');
    });
});
