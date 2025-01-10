import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../reducer';
import { initialLoadedEmptyState } from '../../testUtils/defaultInitialStore';
import { render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../testUtils/WrappedHovedside';
import { mockfnr } from '../../mocks/utils';
import React from 'react';
import { describe } from 'vitest';
import { Status } from '../../createGenericSlice';
import { mockOppfolging } from '../../mocks/data/oppfolging';
import { OppfolgingStatus } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store';

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
                }),
            );
        },
    },
};

describe('Videresend brukere eller render children', () => {
    it('skal vise varsel når bruker har utdatert informasjon i KRR', async () => {
        const store = gitt.hentStatus.utdatertIKrr();
        const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
        await waitFor(() => getByText('Kontaktinformasjonen din er utdatert'));
    });
    it('skal vise varsel når bruker ikke har registrert informasjon i KRR', async () => {
        const store = gitt.hentStatus.ikkeRegistrertIKrr();
        const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
        await waitFor(() => getByText('Vi har ikke din kontaktinformasjon;'));
    });
    it('skal vise varsel når bruker har reservert seg mot digital kommunikasjon i KRR', async () => {
        const store = gitt.hentStatus.reserverIKrr();
        const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
        await waitFor(() => getByText('Kontaktinformasjonen din er utdatert'));
    });
});
