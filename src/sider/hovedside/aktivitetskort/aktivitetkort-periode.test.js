/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AktiviteskortPeriodeVisning from './aktivitetskort-periode';
import {
    MOTE_TYPE,
    IJOBB_AKTIVITET_TYPE,
    SAMTALEREFERAT_TYPE,
} from '../../../constant';

describe('Aktivitet-periode', () => {
    it('Skal vise kun fra dato hvis aktiviten er ett møte med NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17',
            tilDato: '2017-08-20',
            type: MOTE_TYPE,
        };
        const wrapper = shallow(
            <AktiviteskortPeriodeVisning aktivitet={aktivitet} />
        );
        expect(wrapper.find({ children: '17. aug 2017' })).to.have.length(1);
    });

    it('Skal vise til og fra dato hvis aktiviten er ikke ett møte med NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17',
            tilDato: '2017-08-20',
            type: IJOBB_AKTIVITET_TYPE,
        };
        const wrapper = shallow(
            <AktiviteskortPeriodeVisning aktivitet={aktivitet} />
        );
        expect(
            wrapper.find({ children: '17. aug 2017 - 20. aug 2017' })
        ).to.have.length(1);
    });

    it('Skal vise fra dato hvis aktiviten er ett samtalereferat', () => {
        const aktivitet = {
            fraDato: '2017-08-17',
            type: SAMTALEREFERAT_TYPE,
        };
        const wrapper = shallow(
            <AktiviteskortPeriodeVisning aktivitet={aktivitet} />
        );
        expect(wrapper.find({ children: '17. aug 2017' })).to.have.length(1);
    });
});
