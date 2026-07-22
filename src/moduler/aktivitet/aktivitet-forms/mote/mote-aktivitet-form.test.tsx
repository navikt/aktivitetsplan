import { configureStore } from '@reduxjs/toolkit';
import {
    RenderResult,
    fireEvent,
    render,
    screen,
    act,
    ByRoleMatcher,
    ByRoleOptions,
    within,
    SelectorMatcherOptions,
    Matcher,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, addMinutes, differenceInMinutes, subYears } from 'date-fns';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { MOTE_TYPE } from '../../../../constant';
import rootReducer from '../../../../store/rootReducer';
import MoteAktivitetForm from './MoteAktivitetForm';
import { expect, Mock } from 'vitest';
import { Kanal } from '../../../../datatypes/aktivitetTypes';
import { OppfolgingStatusResponse } from '../../../../api/veilarboppfolging';
import { enMoteAktivitet } from '../../../../mocks/fixtures/moteAktivitetFixtures';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';

const initialState: any = {
    data: {
        oppfolging: {
            data: {
                oppfolging: {
                    erUnderOppfolging: true,
                },
            } as Partial<OppfolgingStatusResponse>,
        },
        aktiviteter: [],
    },
};

const dirtyRef = { current: false };
const store = configureStore({ reducer: rootReducer, preloadedState: initialState as any });

function mountWithIntl(node: any): RenderResult {
    return render(<ReduxProvider store={store}>{node}</ReduxProvider>);
}

const fillForm = () => {
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Tema for møtet (obligatorisk)'), {
        target: { value: 'Møte med Nav' },
    });
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Dato (obligatorisk)'), {
        target: { value: '21.09.2029' },
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
        target: { value: 'Møte med Nav' },
    });
    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Forberedelser til møtet (valgfri)'));
};

const getLagreKnapp = (getByRole: (role: ByRoleMatcher, options?: ByRoleOptions | undefined) => HTMLElement) => {
    return getByRole('button', { name: 'Lagre' });
};
const getFormErrorsContainer = (
    getByText: (id: Matcher, options?: SelectorMatcherOptions | undefined) => HTMLElement,
) => {
    const errorBox = getByText('For å gå videre må du rette opp følgende:');
    return errorBox.parentElement!;
};

describe('MoteAktivitetForm', () => {
    it('Skal vise error summary når man submitter uten å oppgi påkrevde verdier', async () => {
        const { queryByText, getByText, getByRole } = mountWithIntl(
            <MoteAktivitetForm onSubmit={() => Promise.resolve()} dirtyRef={dirtyRef} />,
        );
        expect(queryByText('For å gå videre må du rette opp følgende')).toBeNull();
        const lagreKnapp = getLagreKnapp(getByRole);

        await act(() => lagreKnapp.click());

        const errorBoxContainer = getFormErrorsContainer(getByText);
        within(errorBoxContainer).getByText('For å gå videre må du rette opp følgende:');
        within(errorBoxContainer).getByText('Du må fylle ut tema for møtet');
        within(errorBoxContainer).getByText('Du må fylle ut møtested eller annen praktisk informasjon');
        within(errorBoxContainer).getByText('Dato må fylles ut');
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
                    onSubmit={() => Promise.resolve()}
                    dirtyRef={dirtyRef}
                    aktivitet={aktivitet as any}
                />
            </ReduxProvider>,
        );

        fireEvent.click(screen.getByText('Lagre'));
        expect(screen.queryByText('Feiloppsummering')).toBeNull();
    });

    it('Skal vise feil når dato er tidligere enn i dag', async () => {
        const aktivitet = {
            tittel: 'Anakromisme',
            fraDato: subYears(new Date(), 1).toISOString(),
            tilDato: addMinutes(subYears(new Date(), 1), 45).toISOString(),
            adresse: 'Fortiden',
            erAvtalt: false,
        };
        const { getByText } = mountWithIntl(
            <MoteAktivitetForm onSubmit={() => Promise.resolve()} dirtyRef={dirtyRef} aktivitet={aktivitet as any} />,
        );

        await act(async () => {
            fireEvent.click(screen.getByText('Lagre'));
        });

        const errorBoxContainer = getFormErrorsContainer(getByText);
        within(errorBoxContainer).getByText('Dato kan ikke være tilbake i tid');
    });

    it('Skal populere felter når aktivitet er satt', () => {
        const aktivitet = {
            ...enMoteAktivitet(),
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            adresse: 'Slottet',
        };
        const { getByDisplayValue } = mountWithIntl(
            <MoteAktivitetForm onSubmit={() => Promise.resolve()} dirtyRef={dirtyRef} aktivitet={aktivitet} />,
        );

        getByDisplayValue(aktivitet.tittel);
        const date = new Date(aktivitet.fraDato);
        getByDisplayValue(`${date.getDate()}.${'' + (date.getMonth() + 1)}.${date.getFullYear()}`);
        getByDisplayValue('1 time');
        getByDisplayValue(aktivitet.adresse);
    });

    it('Skal ikke populere beskrivelse(hensikt) med defaultverdi når man endrer', () => {
        const aktivitet = {
            ...enMoteAktivitet(),
            beskrivelse: 'Dette er en beskrivelse',
        };
        mountWithIntl(
            <MoteAktivitetForm onSubmit={() => Promise.resolve()} dirtyRef={dirtyRef} aktivitet={aktivitet} />,
        );
        screen.getByDisplayValue('Dette er en beskrivelse');
    });

    it('Skal validere form', async () => {
        const expectedResult = {
            adresse: 'Kontor',
            avtalt: false,
            beskrivelse: 'Møte med Nav',
            // dato: new Date('2023-09-20T22:00:00.000Z'),
            forberedelser: '',
            //  fraDato: '2023-09-21T06:00:00.000Z',
            kanal: 'TELEFON',
            status: 'PLANLAGT',
            // tilDato: '2023-09-21T06:30:00.000Z',
            tittel: 'Møte med Nav',
            varighet: 30,
        };

        const onFormSumbitMock: Mock = vi.fn(() => Promise.resolve());
        const { getByText, queryByText, getByLabelText, getByRole } = mountWithIntl(
            <MoteAktivitetForm onSubmit={onFormSumbitMock} dirtyRef={dirtyRef} />,
        );
        fillForm();
        fireEvent.change(getByLabelText('Varighet (obligatorisk)'), {
            target: { value: '30' },
        });

        const lagreKnapp = getByRole('button', { name: 'Lagre' });
        expect(lagreKnapp).not.toBeDisabled();

        await act(async () => {
            fireEvent.click(getByText('Lagre'));
        });

        expect(queryByText('For å gå videre må du rette opp følgende:')).not.toBeInTheDocument();
        expect(onFormSumbitMock).toHaveBeenCalled();
        const lastcall = onFormSumbitMock.mock.lastCall!![0];
        const { fraDato, tilDato, varighet }: { fraDato: Date; tilDato: Date; varighet: number } = lastcall;
        expect(differenceInMinutes(new Date(tilDato), new Date(fraDato))).toBe(varighet);
        expect(lastcall).toEqual(expect.objectContaining(expectedResult));
    });

    it('Skal selekte riktig varighet', async () => {
        const mock: Mock = vi.fn(() => Promise.resolve());
        mountWithIntl(<MoteAktivitetForm onSubmit={mock} dirtyRef={dirtyRef} />);

        fillForm();
        await userEvent.selectOptions(screen.getByLabelText('Varighet (obligatorisk)'), '2 timer, 30 minutter');

        await act(async () => {
            fireEvent.click(screen.getByText('Lagre'));
        });

        const lastcall = mock.mock.lastCall!![0];
        const { fraDato, tilDato, varighet }: { fraDato: Date; tilDato: Date; varighet: number } = lastcall;
        expect(differenceInMinutes(new Date(tilDato), new Date(fraDato))).toBe(varighet);

        expect(lastcall).toEqual(
            expect.objectContaining({
                adresse: 'Kontor',
                avtalt: false,
                beskrivelse: 'Møte med Nav',
                // dato: new Date('2023-09-20T22:00:00.000Z'),
                forberedelser: '',
                // fraDato: '2023-09-21T06:00:00.000Z',
                kanal: 'TELEFON',
                status: 'PLANLAGT',
                //  tilDato: '2023-09-21T08:30:00.000Z',
                tittel: 'Møte med Nav',
                varighet: 150,
            }),
        );
    });

    it('Skal ikke være disablede felter ved endring av avtalt aktivitet', () => {
        const aktivitet = {
            ...enMoteAktivitet(),
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            adresse: 'Slottet',
            type: VeilarbAktivitetType.MOTE_TYPE as const,
            avtalt: true,
        };
        mountWithIntl(
            <MoteAktivitetForm onSubmit={() => Promise.resolve()} dirtyRef={dirtyRef} aktivitet={aktivitet} />,
        );

        expect(screen.getByLabelText<HTMLInputElement>('Tema for møtet (obligatorisk)').disabled).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Dato (obligatorisk)').disabled).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Klokkeslett (obligatorisk)').disabled).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Varighet (obligatorisk)').disabled).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Møteform (obligatorisk)').disabled).not.toBeTruthy();
        expect(
            screen.getByLabelText<HTMLInputElement>('Møtested eller annen praktisk informasjon (obligatorisk)')
                .disabled,
        ).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Hensikt med møtet (obligatorisk)').disabled).not.toBeTruthy();
        expect(screen.getByLabelText<HTMLInputElement>('Forberedelser til møtet (valgfri)').disabled).not.toBeTruthy();
    });
});
