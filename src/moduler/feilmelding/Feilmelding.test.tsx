import { fireEvent, queryAllByText, render } from '@testing-library/react';
import React from 'react';

import tekster from '../../tekster';
import { hentAktivitet } from '../aktivitet/aktivitet-actions';
import { hentDialoger } from '../dialog/dialog-slice';
import Feilmelding, { getErrorText } from './Feilmelding';

describe('Feilmelding', () => {
    it('Skal vise generell feilmelding ved flere feil', () => {
        const feilmeldinger = [{ type: '' }, { type: '' }];
        const { getByText } = render(<Feilmelding feilmeldinger={feilmeldinger} />);

        getByText(getErrorText(feilmeldinger));
    });

    it('Skal vise aktivitetfeilmelding når kun aktivitet hent feiler', () => {
        const feilmeldinger = [{ type: hentAktivitet.rejected.type }];
        const { getByText } = render(<Feilmelding feilmeldinger={feilmeldinger} />);
        getByText(getErrorText(feilmeldinger));
    });

    it('Skal vise generell feilmelding hvis både aktivitet og andre ting feiler', () => {
        const feilmeldinger = [{ type: hentAktivitet.rejected.type }, { type: '' }];
        const { getByText } = render(<Feilmelding feilmeldinger={feilmeldinger} />);
        getByText(getErrorText(feilmeldinger));
    });
});
