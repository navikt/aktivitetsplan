/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import React from 'react';
import AktiviteskortPeriodeVisning from './aktivitetskort-periode';
import { MOTE_TYPE, IJOBB_AKTIVITET_TYPE } from '../../../constant';
import { mountWithIntl } from '../../../../test/intl-enzyme-test-helper';

describe('Aktivitet-periode', () => {
    it('Skal vise kun fra dato hvis aktiviten er ett møte med NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17',
            tilDato: '2017-08-20',
            type: MOTE_TYPE,
        };
        const wrapper = mountWithIntl(
            <AktiviteskortPeriodeVisning aktivitet={aktivitet} />
        );
        expect(wrapper.text()).toEqual('17. aug 2017');
    });

    it('Skal vise til og fra dato hvis aktiviten er ikke ett møte med NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17',
            tilDato: '2017-08-20',
            type: IJOBB_AKTIVITET_TYPE,
        };
        const wrapper = mountWithIntl(
            <AktiviteskortPeriodeVisning aktivitet={aktivitet} />
        );
        expect(wrapper.text()).toEqual('17. aug 2017 - 20. aug 2017');
    });
});
