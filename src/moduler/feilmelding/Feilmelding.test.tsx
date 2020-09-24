import { mount } from 'enzyme';
import Feilmelding from './Feilmelding';
import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { tekster } from './GetErrorText';
import { HENTING_FEILET as AKTIVITET_HENT_FEILET } from '../aktivitet/aktivitet-action-types';
import { HENTING_FEILET as DIALOG_HENT_FEIL } from '../dialog/dialog-reducer';
import { Normaltekst } from 'nav-frontend-typografi';
import FeilmeldingDetaljer from './FeilmeldingDetaljer';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';

describe('Feilmelding', () => {
    it('Skal vise generell feilmelding ved flere feil', () => {
        const feilmeldinger = [{ type: '' }, { type: '' }];
        const wrapper = mount(<Feilmelding feilmeldinger={feilmeldinger} />);
        const tekst = wrapper.find(AlertStripe).find(Normaltekst).text().trim();

        expect(tekst).toEqual(tekster.fallback);
    });

    it('Skal vise aktivitetfeilmelding når kun aktivitet hent feiler', () => {
        const feilmeldinger = [{ type: AKTIVITET_HENT_FEILET }];
        const wrapper = mount(<Feilmelding feilmeldinger={feilmeldinger} />);

        const tekst = wrapper.find(AlertStripe).find(Normaltekst).text().trim();

        expect(tekst).toEqual(tekster.aktivitetFeilet);
    });

    it('Skal vise generell feilmelding hvis både aktivitet og andre ting feiler', () => {
        const feilmeldinger = [{ type: AKTIVITET_HENT_FEILET }, { type: '' }];
        const wrapper = mount(<Feilmelding feilmeldinger={feilmeldinger} />);
        const tekst = wrapper.find(AlertStripe).find(Normaltekst).text().trim();

        expect(tekst).toEqual(tekster.fallback);
    });

    it('Skal ikke vise feilmelding hvis ingenting feiler', () => {
        const wrapper = mount(<Feilmelding feilmeldinger={[]} />);

        expect(wrapper.find(Feilmelding).html()).toBeNull();
    });

    it('Skal ikke vise debug per default', () => {
        const feilmeldinger = [{ type: AKTIVITET_HENT_FEILET }, { type: DIALOG_HENT_FEIL }];
        const wrapper = mount(<Feilmelding feilmeldinger={feilmeldinger} />);
        const debuginfo = wrapper.find(FeilmeldingDetaljer);

        expect(debuginfo.length).toEqual(0);
    });

    it('Skal vise debug info for alle feil', () => {
        const feilmeldinger = [{ type: AKTIVITET_HENT_FEILET }, { type: DIALOG_HENT_FEIL }];
        const wrapper = mount(<Feilmelding feilmeldinger={feilmeldinger} />);

        wrapper.find(Knappelenke).simulate('click');

        expect(wrapper.find(FeilmeldingDetaljer).length).toEqual(feilmeldinger.length);
    });
});
