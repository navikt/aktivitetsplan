import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../reducer';
import { aktiviteterState, initialLoadedEmptyState } from '../../testUtils/defaultInitialStore';
import { render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../testUtils/WrappedHovedside';
import { mockfnr } from '../../mocks/utils';
import React from 'react';
import { afterAll, beforeAll, describe, expect } from 'vitest';
import { Status } from '../../createGenericSlice';
import { oppfolgingGraphql } from '../../mocks/data/oppfolging';
import { RootState } from '../../store';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { mockTestAktiviteter } from '../../mocks/aktivitet';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { MinimalPeriode } from './oppfolging-selector';
import { OppfolgingStatusResponse } from '../../api/veilarboppfolging';

const defaultOppfolging = oppfolgingGraphql;
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

const storeMedOppfolging = (oppfolging: OppfolgingStatusResponse = defaultOppfolging): RootState => {
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
                    brukerStatus: {
                        ...defaultOppfolging.brukerStatus,
                        manuell: {
                            erManuell: false,
                        },
                        krr: {
                            registrertIKrr: true,
                            reservertIKrr: false,
                            kanVarsles: false,
                        },
                    },
                }),
            );
        },
        ikkeRegistrertIKrr: () => {
            return lagStore(
                storeMedOppfolging({
                    ...defaultOppfolging,
                    brukerStatus: {
                        ...defaultOppfolging.brukerStatus,
                        manuell: {
                            erManuell: false,
                        },
                        krr: {
                            registrertIKrr: false,
                            reservertIKrr: false,
                            kanVarsles: true,
                        },
                    },
                }),
            );
        },
        reserverIKrr: () => {
            return lagStore(
                storeMedOppfolging({
                    ...defaultOppfolging,
                    brukerStatus: {
                        ...defaultOppfolging.brukerStatus,
                        manuell: {
                            erManuell: false,
                        },
                        krr: {
                            registrertIKrr: true,
                            reservertIKrr: true,
                            kanVarsles: true,
                        },
                    },
                }),
            );
        },
        manuell: () => {
            return lagStore(
                storeMedOppfolging({
                    ...defaultOppfolging,
                    brukerStatus: {
                        ...defaultOppfolging.brukerStatus,
                        manuell: {
                            erManuell: true,
                        },
                        krr: {
                            registrertIKrr: true,
                            reservertIKrr: false,
                            kanVarsles: true,
                        },
                    },
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
        it('skal vise varsel når bruker ikke har registrert informasjon i KRR', async () => {
            const store = gitt.hentStatus.ikkeRegistrertIKrr();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Brukeren har ikke registrert kontaktinformasjon i KRR'));
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
        it('skal vise varsel når bruker er utdatert i KRR', async () => {
            const store = gitt.hentStatus.utdatertIKrr();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Brukerens kontaktinformasjon i KRR er utdatert'));
            getByText(aktivitetTittel);
        });
    });
    describe('Brukere:', () => {
        it('skal vise varsel når bruker ikke har registrert informasjon i KRR', async () => {
            const store = gitt.hentStatus.ikkeRegistrertIKrr();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Vi har ikke din kontaktinformasjon'));
            getByText(aktivitetTittel);
        });
        it('skal vise varsel når bruker har reservert seg mot digital kommunikasjon i KRR', async () => {
            const store = gitt.hentStatus.reserverIKrr();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Du har reservert deg mot digital kommunikasjon'));
            getByText(aktivitetTittel);
        });
        it('skal vise dårlig feilmelding når bruker er manuell', async () => {
            const store = gitt.hentStatus.manuell();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() =>
                getByText('Du har ikke digital oppfølging fra Nav. Du har derfor ikke en digital aktivitetsplan.'),
            );
            getByText(aktivitetTittel);
        });
        it('skal vise varsel når bruker er utdatert i KRR', async () => {
            const store = gitt.hentStatus.utdatertIKrr();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Kontaktinformasjonen din er utdatert'));
            getByText(aktivitetTittel);
        });
    });
});
