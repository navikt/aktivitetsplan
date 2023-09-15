import { configureStore } from '@reduxjs/toolkit';
import { RenderResult, fireEvent, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, addMinutes, differenceInMinutes, subYears } from 'date-fns';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { MOTE_TYPE } from '../../../../constant';
import reducer from '../../../../reducer';
import MoteAktivitetForm from './MoteAktivitetForm';
import { expect } from 'vitest';
import { Kanal } from '../../../../datatypes/aktivitetTypes';

const initialState: any = {
    data: {
        oppfolging: { data: { underOppfolging: true } },
        aktiviteter: [],
    },
};

const dirtyRef = { current: false };
const store = configureStore({ reducer, preloadedState: initialState as any });

function mountWithIntl(node: any): RenderResult {
    return render(<ReduxProvider store={store}>{node}</ReduxProvider>);
}

const fillForm = () => {
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Tema for møtet (obligatorisk)'), {
        target: { value: 'Møte med NAV' },
    });
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Dato (obligatorisk)'), {
        target: { value: '21.09.2023' },
    });
    const klokkeslett = new Date('2023-09-20T06:00:00.000Z').getHours();
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Klokkeslett (obligatorisk)'), {
        target: { value: '0' + klokkeslett + ':00' },
    });
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Møteform (obligatorisk)'), {
        target: { value: Kanal.TELEFON },
    });
    fireEvent.change(
        screen.getByLabelText<HTMLInputElement>('Møtested eller annen praktisk informasjon (obligatorisk)'),
        { target: { value: 'Kontor' } },
    );
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Hensikt med møtet (obligatorisk)'), {
        target: { value: 'Møte med NAV' },
    });
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Forberedelser til møtet (valgfri)'));
};
describe('MoteAktivitetForm', () => {
    it.skip('Skal vise error summary når man submitter uten å oppgi påkrevde verdier', async () => {
        const { queryByText, getByText, getByRole } = mountWithIntl(
            <MoteAktivitetForm onSubmit={() => Promise.resolve()} isDirtyRef={dirtyRef} />,
        );
        expect(queryByText('For å gå videre må du rette opp følgende')).toBeNull();

        fireEvent.click(getByRole('button', { name: 'Lagre' }));
        getByRole('button', { name: 'Lagre' }).click();
        getByText('Lagre').click();
        getByText('For å gå videre må du rette opp følgende:');
        getByText('Du må fylle ut tema for møtet');
        getByText('Du må fylle ut møtested eller annen praktisk informasjon');
        getByText('Du må fylle ut dato for møtet');
    });
    it.skip('Skal ikke vise feil når obligatoriske felter er oppgitt', () => {
        const aktivitet = {
            tittel: 'Dette er en test',
            fraDato: addDays(new Date(), 1).toISOString(),
            tilDato: addMinutes(addDays(new Date(), 1), 45).toISOString(),
            type: MOTE_TYPE,
            adresse: 'Slottet',
            kanal: 'OPPMOTE',
            beskrivelse: 'jfioew',
            forberedelser: 'jfioewjfe',
            erAvtalt: false,
        };
        render(
            <ReduxProvider store={store}>
                <MoteAktivitetForm
                    onSubmit={() => new Promise(() => null)}
                    isDirtyRef={dirtyRef}
                    aktivitet={aktivitet as any}
                />
            </ReduxProvider>,
        );

        fireEvent.click(screen.getByText('Lagre'));
        expect(screen.queryByText('Feiloppsummering')).toBeNull();
    });

    it.skip('Skal vise feil når dato er tidligere enn i dag', () => {
        const aktivitet = {
            tittel: 'Anakromisme',
            fraDato: subYears(new Date(), 1).toISOString(),
            tilDato: addMinutes(subYears(new Date(), 1), 45).toISOString(),
            adresse: 'Fortiden',
            erAvtalt: false,
        };
        mountWithIntl(
            <MoteAktivitetForm
                onSubmit={() => new Promise(() => null)}
                isDirtyRef={dirtyRef}
                aktivitet={aktivitet as any}
            />,
        );

        fireEvent.click(screen.getByText('Lagre'));
        screen.getByText('Datoen må tidligst være i dag');
    });

    it.skip('Skal populere felter når aktivitet er satt', () => {
        const aktivitet = {
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            type: MOTE_TYPE,
            adresse: 'Slottet',
        };
        mountWithIntl(<MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} aktivitet={aktivitet} />);

        screen.getByDisplayValue(aktivitet.tittel);
        const date = new Date(aktivitet.fraDato);
        screen.getByDisplayValue(`${date.getDate()}.${'0' + (date.getMonth() + 1)}.${date.getFullYear()}`);
        screen.getByDisplayValue('07:00');
        screen.getByDisplayValue('01:00');
        screen.getByDisplayValue(aktivitet.adresse);
    });

    it('Skal ikke populere beskrivelse(hensikt) med defaultverdi når man endrer', () => {
        const aktivitet = { beskrivelse: 'Dette er en beskrivelse' };
        mountWithIntl(<MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} aktivitet={aktivitet} />);
        screen.getByDisplayValue('Dette er en beskrivelse');
    });

    it('Skal validere form', async () => {
        const expectedResult = {
            adresse: 'Kontor',
            avtalt: false,
            beskrivelse: 'Møte med NAV',
            // dato: new Date('2023-09-20T22:00:00.000Z'),
            forberedelser: '',
            //  fraDato: '2023-09-21T06:00:00.000Z',
            kanal: 'TELEFON',
            klokkeslett: '08:00',
            status: 'PLANLAGT',
            // tilDato: '2023-09-21T06:30:00.000Z',
            tittel: 'Møte med NAV',
            varighet: 30,
        };

        const mock = vi.fn();
        mountWithIntl(<MoteAktivitetForm onSubmit={mock} isDirtyRef={dirtyRef} />);
        fillForm();
        fireEvent.change(screen.getByLabelText<HTMLInputElement>('Varighet (obligatorisk)'), {
            target: { value: '30' },
        });
        await act(async () => {
            fireEvent.click(screen.getByText('Lagre'));
        });

        const lastcall = mock.mock.lastCall[0];
        const { fraDato, tilDato, varighet }: { fraDato: Date; tilDato: Date; varighet: number } = lastcall;
        expect(differenceInMinutes(new Date(tilDato), new Date(fraDato))).toBe(varighet);

        expect(lastcall).toEqual(expect.objectContaining(expectedResult));
    });

    it('Skal selekte riktig varighet', async () => {
        const mock = vi.fn();
        mountWithIntl(<MoteAktivitetForm onSubmit={mock} isDirtyRef={dirtyRef} />);

        fillForm();
        await userEvent.selectOptions(screen.getByLabelText('Varighet (obligatorisk)'), '2 timer, 30 minutter');

        await act(async () => {
            fireEvent.click(screen.getByText('Lagre'));
        });

        const lastcall = mock.mock.lastCall[0];
        const { fraDato, tilDato, varighet }: { fraDato: Date; tilDato: Date; varighet: number } = lastcall;
        expect(differenceInMinutes(new Date(tilDato), new Date(fraDato))).toBe(varighet);

        expect(lastcall).toEqual(
            expect.objectContaining({
                adresse: 'Kontor',
                avtalt: false,
                beskrivelse: 'Møte med NAV',
                // dato: new Date('2023-09-20T22:00:00.000Z'),
                forberedelser: '',
                // fraDato: '2023-09-21T06:00:00.000Z',
                kanal: 'TELEFON',
                klokkeslett: '08:00',
                status: 'PLANLAGT',
                //  tilDato: '2023-09-21T08:30:00.000Z',
                tittel: 'Møte med NAV',
                varighet: 150,
            }),
        );
    });

    it('Skal være disablede felter ved endring av aktivitet', () => {
        const aktivitet = {
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            adresse: 'Slottet',
            type: MOTE_TYPE,
            avtalt: true,
        };
        mountWithIntl(<MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} aktivitet={aktivitet} />);

        expect(screen.getByLabelText<HTMLInputElement>('Tema for møtet (obligatorisk)').disabled).toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Dato (obligatorisk)').disabled).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Klokkeslett (obligatorisk)').disabled).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Varighet (obligatorisk)').disabled).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Møteform (obligatorisk)').disabled).not.toBeTruthy();
        expect(
            screen.getByLabelText<HTMLInputElement>('Møtested eller annen praktisk informasjon (obligatorisk)')
                .disabled,
        ).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Hensikt med møtet (obligatorisk)').disabled).toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Forberedelser til møtet (valgfri)').disabled).toBeTruthy();
    });
});
