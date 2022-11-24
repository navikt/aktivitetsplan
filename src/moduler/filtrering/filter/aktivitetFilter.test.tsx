import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { STATUS } from '../../../api/utils';
import { EksternAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import Hovedside from '../../../hovedside/Hovedside';
import { aktiviteterData } from '../../../mocks/aktivitet';
import reducer from '../../../reducer';
import create from '../../../store';

// window. = jest.fn();
window.IntersectionObserver = jest.fn();
jest.mock('react-dnd', () => ({
    useDrag: () => {
        let ref = null;
        return [{}, ref];
    },
    useDrop: () => {
        let ref = null;
        return [{}, ref];
    },
    DndProvider: ({ children }) => <>{children}</>,
}));
jest.mock('react-dnd-html5-backend', () => ({}));
jest.mock('react-intl', () => ({
    FormattedMessage: ({ id }) => id,
}));

const aktiviteter = aktiviteterData.aktiviteter;
/*
const store = {
    data: {
        filters: {},
    },
};*/

export const oppfolging = {
    aktorId: '1234567988888',
    veilederId: null,
    reservasjonKRR: true,
    manuell: false,
    underOppfolging: true,
    underKvp: false,
    oppfolgingUtgang: null,
    gjeldendeEskaleringsvarsel: null,
    kanStarteOppfolging: false,
    avslutningStatus: null,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    servicegruppe: 'IVURD',
    oppfPerioder: [
        {
            aktorId: '1234567988888',
            veileder: null,
            startDato: '2018-01-31T10:46:10.971+01:00',
            sluttDato: null,
            begrunnelse: null,
        },
    ],
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00',
};

const identitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

const eksternAktivitet = {
    type: VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE,
} as EksternAktivitet;

const initialStore = {
    ...reducer({}, { type: 'INITAL' }),
};

initialStore.data.aktiviteter.status = STATUS.OK;
initialStore.data.arenaAktiviteter.status = STATUS.OK;
initialStore.data.aktiviteter.data = aktiviteter;
initialStore.data.oppfolging.data = oppfolging;
initialStore.data.oppfolging.status = STATUS.OK;
initialStore.data.identitet.status = STATUS.OK;
initialStore.data.identitet.data = identitet;
initialStore.data.feature.data = { ignore: false };
initialStore.data.feature.status = STATUS.OK;

const store = create(initialStore);

const WrappedHovedside = () => {
    return (
        <Provider store={store}>
            <MemoryRouter>
                <Hovedside />
            </MemoryRouter>
        </Provider>
    );
};

describe('aktivitets-filter', () => {
    it('should filter avtalt med nav', async () => {
        render(<WrappedHovedside />);
        fireEvent.click(screen.getByText('Filtrer'));
        fireEvent.click(screen.getByText('Ikke avtalt med NAV'));
        screen.getByText('Assisterende skipskokk');
        fireEvent.click(screen.getByText('Filtrer'));
        fireEvent.click(screen.getByText('Avtalt med NAV'));
        fireEvent.click(screen.getByText('Ikke avtalt med NAV'));
        expect(screen.queryByText('Assisterende skipskokk')).toBeNull();
    });
});
