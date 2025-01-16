import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../reducer';
import { initialLoadedEmptyState } from '../../testUtils/defaultInitialStore';
import { render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../testUtils/WrappedHovedside';
import { mockfnr } from '../../mocks/utils';
import React from 'react';
import { afterAll, beforeAll, describe } from 'vitest';
import { Status } from '../../createGenericSlice';
import { mockOppfolging } from '../../mocks/data/oppfolging';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';

const defaultOppfolging = mockOppfolging;

const storeMedOppfolging = (oppfolging: OppfolgingStatus = defaultOppfolging) => {
    return {
        ...initialLoadedEmptyState,
        data: {
            ...initialLoadedEmptyState.data,
            oppfolging: {
                status: Status.OK,
                data: oppfolging,
            },
        },
    };
};

const lagStore = (initialStore: RootState) =>
    configureStore({
        reducer,
        preloadedState: initialStore,
    });

const gitt = {
    hentStatus: {
        utdatertIKrr: () => {
            return lagStore(
                storeMedOppfolging({
                    ...defaultOppfolging,
                    kanVarsles: false,
                    registrertKRR: true,
                    reservasjonKRR: false,
                    manuell: false,
                }),
            );
        },
        ikkeRegistrertIKrr: () => {
            return lagStore(
                storeMedOppfolging({
                    ...defaultOppfolging,
                    kanVarsles: true,
                    registrertKRR: false,
                    reservasjonKRR: false,
                    manuell: false,
                }),
            );
        },
        reserverIKrr: () => {
            return lagStore(
                storeMedOppfolging({
                    ...defaultOppfolging,
                    kanVarsles: true,
                    registrertKRR: true,
                    reservasjonKRR: true,
                    manuell: false,
                }),
            );
        },
        manuell: () => {
            return lagStore(
                storeMedOppfolging({
                    ...defaultOppfolging,
                    kanVarsles: true,
                    registrertKRR: true,
                    reservasjonKRR: false,
                    manuell: true,
                }),
            );
        },
    },
};

const server = setupServer(...handlers);

describe('Videresend brukere eller render children', () => {
    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'error' });
    });
    afterAll(() => {
        server.close();
    });

    describe('Veiledere:', () => {
        it('TODO: skal vise varsel når bruker har utdatert informasjon i KRR', async () => {
            const store = gitt.hentStatus.utdatertIKrr();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            // TODO: Vurder å vise feilmelding her
            // await waitFor(() => getByText('Kontaktinformasjonen din er utdatert'));
        });
        it('skal vise varsel når bruker ikke har registrert informasjon i KRR', async () => {
            const store = gitt.hentStatus.ikkeRegistrertIKrr();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Brukeren er ikke registrert i KRR'));
        });
        it('skal vise varsel når bruker har reservert seg mot digital kommunikasjon i KRR', async () => {
            const store = gitt.hentStatus.reserverIKrr();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Brukeren er reservert i KRR'));
        });
        it('skal vise FEILMEDLING FOR BRUKER? når bruker er manuell', async () => {
            const store = gitt.hentStatus.manuell();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() =>
                getByText('Du har ikke digital oppfølging fra Nav. Du har derfor ikke en digital aktivitetsplan.'),
            );
        });
    });
    describe('Brukere:', () => {
        it('TODO: skal vise varsel når bruker har utdatert informasjon i KRR', async () => {
            const store = gitt.hentStatus.utdatertIKrr();
            const { getByText } = render(<WrappedHovedside store={store} />);
            // Rendrer aktivitetsplan som normalt her, TODO: fiks logikk og test
            // await waitFor(() => getByText('Kontaktinformasjonen din er utdatert'));
        });
        it('skal vise varsel når bruker ikke har registrert informasjon i KRR', async () => {
            const store = gitt.hentStatus.ikkeRegistrertIKrr();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Vi har ikke din kontaktinformasjon'));
        });
        it('skal vise varsel når bruker har reservert seg mot digital kommunikasjon i KRR', async () => {
            const store = gitt.hentStatus.reserverIKrr();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Du har reservert deg mot digital kommunikasjon'));
        });
        it('skal vise dårlig feilmelding når bruker er manuell', async () => {
            const store = gitt.hentStatus.manuell();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() =>
                getByText('Du har ikke digital oppfølging fra Nav. Du har derfor ikke en digital aktivitetsplan.'),
            );
        });
    });
});
