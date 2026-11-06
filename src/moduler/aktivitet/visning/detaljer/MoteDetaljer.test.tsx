import { render as renderWithTestingLibrary, screen, within } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { MotedeltakerRolle } from '../../../../datatypes/internAktivitetTypes';
import { enMoteAktivitet } from '../../../../mocks/fixtures/moteAktivitetFixtures';
import MoteDetaljer from './MoteDetaljer';
import { ErVeilederContext } from '../../../../Provider';

const render = (node: React.ReactNode, erVeileder = true) => {
    return renderWithTestingLibrary(<ErVeilederContext.Provider value={erVeileder}>{node}</ErVeilederContext.Provider>);
};

describe('MoteDetaljer', () => {
    it.each([
        { erVeileder: true, navn: 'Lagret Bruker' },
        { erVeileder: false, navn: 'Du' },
    ])('viser $navn fra lagret brukerdeltaker (erVeileder=$erVeileder)', ({ erVeileder, navn }) => {
        render(
            <MoteDetaljer
                aktivitet={enMoteAktivitet({
                    motedeltakere: [{ navn: 'Lagret Bruker', roller: [MotedeltakerRolle.BRUKER] }],
                })}
            />,
            erVeileder,
        );

        expect(screen.getAllByRole('listitem')[0].textContent).toBe(navn);
    });

    it('viser deltakerne under en seksjonstittel, uten kulepunkt eller innrykk', () => {
        render(
            <MoteDetaljer
                aktivitet={enMoteAktivitet({
                    motedeltakere: [
                        { navn: 'Lagret Bruker', roller: [MotedeltakerRolle.BRUKER] },
                        { navn: 'Test Veileder', roller: [MotedeltakerRolle.VEILEDER] },
                        {
                            navn: 'Test Arbeidsgiver',
                            roller: [MotedeltakerRolle.ARBEIDSGIVER, MotedeltakerRolle.MENTOR_FADDER],
                        },
                        { navn: 'Test Tolk', roller: [MotedeltakerRolle.TOLK] },
                    ],
                })}
            />,
        );

        expect(screen.getByRole('heading', { name: 'Deltakere' })).toBeInTheDocument();
        const liste = screen.getByRole('list');
        expect(liste).toHaveClass('list-none', 'p-0', 'm-0');
        expect(
            within(liste)
                .getAllByRole('listitem')
                .map((rad) => rad.textContent),
        ).toEqual([
            'Lagret Bruker',
            'Test Veileder (Veileder)',
            'Test Arbeidsgiver (Arbeidsgiver, Mentor/Fadder)',
            'Test Tolk (Tolk)',
        ]);
    });

    it('viser bare rollen uten parentes når backend har visket ut navnet på tolken', () => {
        render(
            <MoteDetaljer
                aktivitet={enMoteAktivitet({
                    motedeltakere: [{ navn: '', roller: [MotedeltakerRolle.TOLK] }],
                })}
            />,
        );

        expect(screen.getAllByRole('listitem').map((rad) => rad.textContent)).toEqual(['Tolk']);
    });

    it.each([undefined, null, []])(
        'skjuler deltakerseksjonen når deltakerlisten er tom eller mangler (%s)',
        (motedeltakere) => {
            render(<MoteDetaljer aktivitet={enMoteAktivitet({ motedeltakere })} />);

            expect(screen.queryByRole('heading', { name: 'Deltakere' })).not.toBeInTheDocument();
            expect(screen.queryByRole('list')).not.toBeInTheDocument();
            expect(screen.queryByText('Bruker', { exact: true })).not.toBeInTheDocument();
        },
    );
});
