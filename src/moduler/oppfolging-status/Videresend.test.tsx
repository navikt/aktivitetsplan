import { aktivVeilarbOppfolgingMockPeriode } from '../../testUtils/store/defaultInitialStore';
import { render, waitFor } from '@testing-library/react';
import { WrappedHovedside } from '../../testUtils/WrappedHovedside';
import { mockfnr } from '../../mocks/utils';
import React from 'react';
import { afterAll, beforeAll, describe } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { mockTestAktiviteter } from '../../mocks/aktivitet';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { gitt } from '../../testUtils/store/mockStoreBuilder';

const aktivitetTittel = 'Videresend aktivitet';
const aktivitet: VeilarbAktivitet = {
    ...mockTestAktiviteter[0],
    tittel: aktivitetTittel,
    oppfolgingsperiodeId: aktivVeilarbOppfolgingMockPeriode.id,
};

const defaultStore = gitt().aktiviteter.medAktiviteter([aktivitet]);

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
            const store = defaultStore.oppfolging.ikkeRegistrertIKrr().createStore();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Brukeren har ikke registrert kontaktinformasjon i KRR'));
            getByText(aktivitetTittel);
        });
        it('skal vise varsel når bruker har reservert seg mot digital kommunikasjon i KRR', async () => {
            const store = defaultStore.oppfolging.reserverIKrr().createStore();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Brukeren er reservert i KRR'));
            getByText(aktivitetTittel);
        });
        it('skal vise aktivitetsplan når bruker er manuell', async () => {
            const store = defaultStore.oppfolging.manuell().createStore();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText(aktivitetTittel));
            getByText(aktivitetTittel);
        });
        it('skal vise varsel når bruker er utdatert i KRR', async () => {
            const store = defaultStore.oppfolging.utdatertIKrr().createStore();
            const { getByText } = render(<WrappedHovedside fnr={mockfnr} store={store} />);
            await waitFor(() => getByText('Brukerens kontaktinformasjon i KRR er utdatert'));
            getByText(aktivitetTittel);
        });
    });
    describe('Brukere:', () => {
        it('skal vise varsel når bruker ikke har registrert informasjon i KRR', async () => {
            const store = defaultStore.oppfolging.ikkeRegistrertIKrr().createStore();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Vi har ikke din kontaktinformasjon'));
            getByText(aktivitetTittel);
        });
        it('skal vise varsel når bruker har reservert seg mot digital kommunikasjon i KRR', async () => {
            const store = defaultStore.oppfolging.reserverIKrr().createStore();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Du har reservert deg mot digital kommunikasjon'));
            getByText(aktivitetTittel);
        });
        it('skal vise dårlig feilmelding når bruker er manuell', async () => {
            const store = defaultStore.oppfolging.manuell().createStore();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() =>
                getByText('Du har ikke digital oppfølging fra Nav. Du har derfor ikke en digital aktivitetsplan.'),
            );
            getByText(aktivitetTittel);
        });
        it('skal vise varsel når bruker er utdatert i KRR', async () => {
            const store = defaultStore.oppfolging.utdatertIKrr().createStore();
            const { getByText } = render(<WrappedHovedside store={store} />);
            await waitFor(() => getByText('Kontaktinformasjonen din er utdatert'));
            getByText(aktivitetTittel);
        });
    });
});
