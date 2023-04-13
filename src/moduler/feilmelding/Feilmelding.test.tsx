import { fireEvent, queryAllByText, render } from '@testing-library/react';
import React from 'react';

import { hentAktivitet } from '../aktivitet/aktivitet-actions';
import { hentDialoger } from '../dialog/dialog-slice';
import Feilmelding from './Feilmelding';
import { tekster } from './GetErrorText';

describe('Feilmelding', () => {
    it('Skal vise generell feilmelding ved flere feil', () => {
        const feilmeldinger = [{ type: '' }, { type: '' }];
        const { getByText } = render(<Feilmelding feilmeldinger={feilmeldinger} />);

        getByText(tekster.fallback);
    });

    it('Skal vise aktivitetfeilmelding når kun aktivitet hent feiler', () => {
        const feilmeldinger = [{ type: hentAktivitet.rejected.type }];
        const { getByText } = render(<Feilmelding feilmeldinger={feilmeldinger} />);
        getByText(tekster.aktivitetFeilet);
    });

    it('Skal vise generell feilmelding hvis både aktivitet og andre ting feiler', () => {
        const feilmeldinger = [{ type: hentAktivitet.rejected.type }, { type: '' }];
        const { getByText } = render(<Feilmelding feilmeldinger={feilmeldinger} />);
        getByText(tekster.fallback);
    });

    it('Skal ikke vise feilmelding hvis ingenting feiler', () => {
        const { queryByText } = render(<Feilmelding feilmeldinger={[]} />);
        expect(queryByText(tekster.fallback)).toBeNull();
    });

    it('Skal vise debug info for alle feil', () => {
        const feilmeldinger = [{ type: hentAktivitet.rejected.type }, { type: hentDialoger.rejected.type }];
        const { getByText } = render(<Feilmelding feilmeldinger={feilmeldinger} />);
        fireEvent.click(getByText('Vis detaljer'));
        expect(queryAllByText(getByText('Vis detaljer'), 'aktivitet/hent/fail')).not.toBeNull();
        expect(queryAllByText(getByText('Vis detaljer'), 'dialog/hent/fail')).not.toBeNull();
    });
});
