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
import { MotedeltakerRolle, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { ErVeilederContext } from '../../../../Provider';

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
        veileder: {
            data: { fornavn: 'Test', etternavn: 'Veileder' },
        },
    },
};

const dirtyRef = { current: false };
const store = configureStore({ reducer: rootReducer, preloadedState: initialState as any });

function mountWithIntl(node: any): RenderResult {
    return render(
        <ErVeilederContext.Provider value={true}>
            <ReduxProvider store={store}>{node}</ReduxProvider>
        </ErVeilederContext.Provider>,
    );
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
    it('Skal vise bruker og innlogget veileder som faste deltakere', () => {
        mountWithIntl(<MoteAktivitetForm onSubmit={() => Promise.resolve()} dirtyRef={dirtyRef} />);

        expect(screen.getByLabelText('Bruker')).toHaveAttribute('readonly');
        expect(screen.getByLabelText('Bruker')).toHaveValue('Bruker');
        expect(screen.getByRole('textbox', { name: 'Veileder' })).toHaveValue('Test Veileder');
        expect(screen.queryByRole('button', { name: /Fjern/ })).not.toBeInTheDocument();
    });

    it('Skal legge til deltakere med flere roller og sende dem med skjemaet', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn((_data: unknown) => Promise.resolve());
        mountWithIntl(<MoteAktivitetForm onSubmit={onSubmit} dirtyRef={dirtyRef} />);
        fillForm();
        await user.selectOptions(screen.getByLabelText('Varighet (obligatorisk)'), '30');
        await user.click(screen.getByRole('button', { name: 'Legg til flere deltakere' }));
        expect(screen.getByLabelText('Deltakers navn')).toHaveFocus();
        await user.type(screen.getByLabelText('Deltakers navn'), '  Test Deltaker  ');
        await user.click(screen.getByRole('button', { name: /Deltakers rolle/ }));
        await user.click(screen.getByRole('menuitemcheckbox', { name: 'Arbeidsgiver' }));
        await user.click(screen.getByRole('menuitemcheckbox', { name: 'Mentor/Fadder' }));
        await user.keyboard('{Escape}');
        await user.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                motedeltakere: [
                    { navn: 'Test Veileder', roller: [MotedeltakerRolle.VEILEDER] },
                    {
                        navn: 'Test Deltaker',
                        roller: [MotedeltakerRolle.ARBEIDSGIVER, MotedeltakerRolle.MENTOR_FADDER],
                    },
                ],
            }),
        );
        expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('deltakere');
    });

    it('Skal kreve rolle når navn er fylt ut og lenke til rollefeltet fra feiloppsummeringen', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn(() => Promise.resolve());
        mountWithIntl(<MoteAktivitetForm onSubmit={onSubmit} dirtyRef={dirtyRef} />);
        fillForm();
        await user.selectOptions(screen.getByLabelText('Varighet (obligatorisk)'), '30');
        await user.click(screen.getByRole('button', { name: 'Legg til flere deltakere' }));
        await user.type(screen.getByLabelText('Deltakers navn'), 'Test Deltaker');
        await user.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByRole('link', { name: 'Du må velge minst én rolle for deltakeren' })).toHaveAttribute(
            'href',
            `#${screen.getByRole('button', { name: /Deltakers rolle/ }).id}`,
        );
    });

    it('Skal kreve navn når rolle er valgt og vise informasjon om tolk', async () => {
        const user = userEvent.setup();
        mountWithIntl(<MoteAktivitetForm onSubmit={() => Promise.resolve()} dirtyRef={dirtyRef} />);
        await user.click(screen.getByRole('button', { name: 'Legg til flere deltakere' }));
        await user.click(screen.getByRole('button', { name: /Deltakers rolle/ }));
        await user.click(screen.getByRole('menuitemcheckbox', { name: 'Tolk' }));
        await user.keyboard('{Escape}');
        expect(screen.getByText('Navnet på tolk vises ikke for andre enn Nav.')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Lagre' }));
        expect(screen.getByRole('link', { name: 'Du må fylle ut navn på deltakeren' })).toHaveAttribute(
            'href',
            `#${screen.getByLabelText('Deltakers navn').id}`,
        );
    });

    it('Skal fjerne deltakere og utelate tomme rader fra innsendte verdier', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn(() => Promise.resolve());
        mountWithIntl(<MoteAktivitetForm onSubmit={onSubmit} dirtyRef={dirtyRef} />);
        fillForm();
        await user.selectOptions(screen.getByLabelText('Varighet (obligatorisk)'), '30');
        await user.click(screen.getByRole('button', { name: 'Legg til flere deltakere' }));
        await user.type(screen.getByLabelText('Deltakers navn'), 'Skal fjernes');
        await user.click(screen.getByRole('button', { name: 'Fjern deltaker 2' }));
        expect(screen.queryByDisplayValue('Skal fjernes')).not.toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Veileder' })).toHaveFocus();
        await user.click(screen.getByRole('button', { name: 'Legg til flere deltakere' }));
        await user.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                motedeltakere: [{ navn: 'Test Veileder', roller: [MotedeltakerRolle.VEILEDER] }],
            }),
        );
    });

    it('Skal hente eksisterende deltakere og bevare veilederens roller ved redigering', () => {
        const aktivitet = enMoteAktivitet({
            motedeltakere: [
                { navn: 'Test Arbeidsgiver', roller: [MotedeltakerRolle.ARBEIDSGIVER] },
                { navn: 'Opprinnelig Veileder', roller: [MotedeltakerRolle.VEILEDER, MotedeltakerRolle.ANNET] },
            ],
        });
        mountWithIntl(
            <MoteAktivitetForm onSubmit={() => Promise.resolve()} dirtyRef={dirtyRef} aktivitet={aktivitet} />,
        );
        expect(screen.getByRole('textbox', { name: 'Veileder' })).toHaveValue('Opprinnelig Veileder');
        expect(screen.getByLabelText('Deltakers navn')).toHaveValue('Test Arbeidsgiver');
        expect(screen.getByRole('button', { name: /Deltakers rolle Arbeidsgiver/ })).toBeInTheDocument();
        expect(dirtyRef.current).toBe(false);
    });

    it('Skal bevare metadata, men ikke sende bruker fra en eldre backend-respons', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn((_data: unknown) => Promise.resolve());
        const veileder = {
            navn: 'Lagret Veileder',
            roller: [MotedeltakerRolle.VEILEDER, MotedeltakerRolle.ANNET],
            opprettet: '2026-11-04T12:00:00+01:00',
            deltakerId: '01234567-89ab-4cde-8f01-234567890abc',
        };
        const bruker = {
            navn: 'Navn fra eldre respons',
            roller: [MotedeltakerRolle.BRUKER],
            opprettet: '2026-11-04T12:00:00+01:00',
            deltakerId: '01234567-89ab-4cde-8f01-234567890def',
        };
        mountWithIntl(
            <MoteAktivitetForm
                onSubmit={onSubmit}
                dirtyRef={dirtyRef}
                aktivitet={enMoteAktivitet({ motedeltakere: [bruker, veileder] })}
            />,
        );
        expect(screen.getByLabelText('Bruker')).toHaveValue('Bruker');
        expect(screen.queryByLabelText('Deltakers navn')).not.toBeInTheDocument();
        fillForm();
        await user.selectOptions(screen.getByLabelText('Varighet (obligatorisk)'), '30');
        await user.clear(screen.getByRole('textbox', { name: 'Veileder' }));
        await user.type(screen.getByRole('textbox', { name: 'Veileder' }), 'Endret Veileder');
        await user.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ motedeltakere: [{ ...veileder, navn: 'Endret Veileder' }] }),
        );
        expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('deltakere');
    });

    it('Skal markere deltakerendringer som ulagret og kreve navn på veilederen', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn(() => Promise.resolve());
        mountWithIntl(<MoteAktivitetForm onSubmit={onSubmit} dirtyRef={dirtyRef} />);
        expect(dirtyRef.current).toBe(false);
        await user.clear(screen.getByRole('textbox', { name: 'Veileder' }));
        expect(dirtyRef.current).toBe(true);
        await user.click(screen.getByRole('button', { name: 'Lagre' }));
        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByRole('link', { name: 'Du må fylle ut navn på veilederen' })).toHaveAttribute(
            'href',
            `#${screen.getByRole('textbox', { name: 'Veileder' }).id}`,
        );
    });

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
        const lastcall = onFormSumbitMock.mock.lastCall![0];
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

        const lastcall = mock.mock.lastCall![0];
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
