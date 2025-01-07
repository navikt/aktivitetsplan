import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../reducer';
import { aktiviteterState, initialLoadedEmptyState } from '../../testUtils/defaultInitialStore';
import { render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../testUtils/WrappedHovedside';
import { mockfnr } from '../../mocks/utils';
import React from 'react';
import { afterAll, beforeAll, describe, expect } from 'vitest';
import { Status } from '../../createGenericSlice';
import { mockOppfolging } from '../../mocks/data/oppfolging';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { mockTestAktiviteter } from '../../mocks/aktivitet';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { MinimalPeriode } from './oppfolging-selector';

const defaultOppfolging = mockOppfolging;
const aktivitetTittel = 'Videresend aktivitet';
const periode: MinimalPeriode = {
    id: 1,
    start: new Date().toISOString(),
    slutt: undefined,
};
const aktivitet: VeilarbAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: aktivitetTittel,
    oppfolgingsperiodeId: periode.id,
};
const stateMedAktiviteter = aktiviteterState({ aktiviteter: [aktivitet], oppfolgingsPerioder: [periode] });

const storeMedOppfolging = (oppfolging: OppfolgingStatus = defaultOppfolging): RootState => {
    return {
        ...initialLoadedEmptyState,
        data: {
            ...initialLoadedEmptyState.data,
            aktiviteter: stateMedAktiviteter,
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
            getByText(aktivitetTittel);
        });
        it('skal vise varsel når bruker har reservert seg mot digital kommunikasjon i KRR', async () => {
            const store = gitt.hentStatus.reserverIKrr();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Brukeren er reservert i KRR'));
            getByText(aktivitetTittel);
        });
        it('skal vise aktivitetsplan når bruker er manuell', async () => {
            const store = gitt.hentStatus.manuell();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText(aktivitetTittel));
            getByText(aktivitetTittel);
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
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Vi har ikke din kontaktinformasjon'));
            expect(queryByText(aktivitetTittel)).toBeFalsy();
        });
        it('skal vise varsel når bruker har reservert seg mot digital kommunikasjon i KRR', async () => {
            const store = gitt.hentStatus.reserverIKrr();
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Du har reservert deg mot digital kommunikasjon'));
            expect(queryByText(aktivitetTittel)).toBeFalsy();
        });
        it('skal vise dårlig feilmelding når bruker er manuell', async () => {
            const store = gitt.hentStatus.manuell();
            const { getByText, queryByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() =>
                getByText('Du har ikke digital oppfølging fra Nav. Du har derfor ikke en digital aktivitetsplan.'),
            );
            expect(queryByText(aktivitetTittel)).toBeFalsy();
        });
    });
});
