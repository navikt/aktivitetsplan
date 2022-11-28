/*
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { STATUS } from '../../../api/utils';
import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { OppfolgingStatus, OppfolgingsPeriode } from '../../../datatypes/oppfolgingTypes';
import Hovedside from '../../../hovedside/Hovedside';
import { aktiviteterData } from '../../../mocks/aktivitet';
import reducer from '../../../reducer';
import create from '../../../store';
import { aktivitetTypeMap } from '../../../utils/textMappers';
import { HENT_AKTIVITET_OK } from '../../aktivitet/aktivitet-action-types';

window.IntersectionObserver = jest.fn();
// Mocked because react-dnd uses es6 import and have to be transpiled to work in these tests
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

export const oppfolging: OppfolgingStatus = {
    aktorId: '1234567988888',
    veilederId: null,
    reservasjonKRR: true,
    manuell: false,
    underOppfolging: true,
    underKvp: false,
    kanStarteOppfolging: false,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    servicegruppe: 'IVURD',
    oppfolgingsPerioder: [
        {
            uuid: 'uuid-here',
            aktorId: '1234567988888',
            veileder: null,
            startDato: '2018-01-31T10:46:10.971+01:00',
            sluttDato: null,
            begrunnelse: null,
            kvpPerioder: [],
        } as OppfolgingsPeriode,
    ],
    inaktiveringsdato: new Date('2018-08-31T10:46:10.971+01:00'),
};

const identitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

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

let id = 12012;
const exampleAktivitet = aktiviteter[0];
function makeTestAktiviteter<T>(
    filterValues: T[],
    valueSetter: (aktivitet: AlleAktiviteter, value: T) => AlleAktiviteter
) {
    const testAktiviteter = filterValues.map((filterValue) => {
        id += 1;
        return {
            ...valueSetter(exampleAktivitet, filterValue),
            id,
            tittel: `Aktivitet: ${exampleAktivitet.type}`,
        };
    });
    store.dispatch({
        type: HENT_AKTIVITET_OK,
        data: testAktiviteter,
    });
    return testAktiviteter.map(({ tittel, type }) => ({ tittel, type }));
}

describe('aktivitets-filter', () => {
    it.skip('should filter avtalt med nav', async () => {
        render(<WrappedHovedside />);
        makeTestAktiviteter([true, false], (aktivitet, value) => {
            return {
                ...aktivitet,
                avtalt: value,
            };
        });
        fireEvent.click(screen.getByText('Filtrer'));
        fireEvent.click(screen.getByText('Ikke avtalt med NAV'));
        screen.getByText('Assisterende skipskokk');
        fireEvent.click(screen.getByText('Filtrer'));
        fireEvent.click(screen.getByText('Avtalt med NAV'));
        fireEvent.click(screen.getByText('Ikke avtalt med NAV'));
        expect(screen.queryByText('Assisterende skipskokk')).toBeNull();
    });

    it.skip('should filter on aktivitet type', async () => {
        const aktivitetTyper = [VeilarbAktivitetType.STILLING_FRA_NAV_TYPE, VeilarbAktivitetType.MOTE_TYPE];
        render(<WrappedHovedside />);
        const aktiviteter = makeTestAktiviteter(aktivitetTyper, (aktivitet, value) => {
            return {
                ...aktivitet,
                type: value,
            };
        });
        aktiviteter.forEach(({ tittel, type }) => {
            console.log(aktivitetTypeMap[type]);
            fireEvent.click(screen.getByText('Filtrer'));
            fireEvent.click(screen.getByText(aktivitetTypeMap[type]));
            screen.getByText(tittel);
            fireEvent.click(screen.getByText('Filtrer'));
            fireEvent.click(screen.getByText('Avtalt med NAV'));
            fireEvent.click(screen.getByText('Ikke avtalt med NAV'));
            expect(screen.queryByText(tittel)).toBeNull();
        });
    });
});
*/
