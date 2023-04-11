import { mount } from 'enzyme';
import React from 'react';

import { IJOBB_AKTIVITET_TYPE, MOTE_TYPE, STILLING_FRA_NAV_TYPE } from '../../../constant';
import AktiviteskortPeriodeVisning from './AktivitetskortPeriode';

describe('Aktivitet-periode', () => {
    it('Skal vise kun fra dato hvis aktiviten er ett møte med NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17T09:00:00.000',
            tilDato: '2017-09-17T09:00:00.000',
            opprettetDato: '2017-03-17T09:00:00.000',
            type: MOTE_TYPE,
        };
        const wrapper = mount(<AktiviteskortPeriodeVisning aktivitet={aktivitet} />);
        expect(wrapper.text()).toEqual('17. aug. 2017');
    });

    it('Skal vise til og fra dato hvis aktiviten er ikke ett møte med NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17T09:00:00.000',
            tilDato: '2017-08-20T09:00:00.000',
            opprettetDato: '2017-08-17T09:00:00.000',
            type: IJOBB_AKTIVITET_TYPE,
        };
        const wrapper = mount(<AktiviteskortPeriodeVisning aktivitet={aktivitet} />);
        expect(wrapper.text()).toEqual('17. aug. 2017 - 20. aug. 2017');
    });

    it('Skal ikke rendere perioden hvis aktiviten er en stilling fra NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17T09:00:00.000',
            tilDato: '2017-08-20T09:00:00.000',
            opprettetDato: '2015-08-20',
            type: STILLING_FRA_NAV_TYPE,
        };
        const wrapper = mount(<AktiviteskortPeriodeVisning aktivitet={aktivitet} />);
        expect(wrapper.isEmptyRender()).toBe(true);
    });
});
