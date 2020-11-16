import { mount } from 'enzyme';
import React from 'react';
import { intlShape } from 'react-intl';

import { IJOBB_AKTIVITET_TYPE, MOTE_TYPE } from '../../../constant';
import AktiviteskortPeriodeVisning from './AktivitetskortPeriode';

function nodeWithIntlProp(node) {
    return React.cloneElement(node, { intl });
}

function mountWithIntl(node, { context, childContextTypes } = {}) {
    return mount(nodeWithIntlProp(node), {
        context: { ...context, intl },
        childContextTypes: {
            intl: intlShape,
            ...childContextTypes,
        },
    });
}

describe('Aktivitet-periode', () => {
    it('Skal vise kun fra dato hvis aktiviten er ett møte med NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17',
            tilDato: '2017-08-20',
            opprettetDato: '2015-08-20',
            type: MOTE_TYPE,
        };
        const wrapper = mount(<AktiviteskortPeriodeVisning aktivitet={aktivitet} />);
        expect(wrapper.text()).toEqual('17. aug 2017');
    });

    it('Skal vise til og fra dato hvis aktiviten er ikke ett møte med NAV', () => {
        const aktivitet = {
            fraDato: '2017-08-17',
            tilDato: '2017-08-20',
            opprettetDato: '2015-08-20',
            type: IJOBB_AKTIVITET_TYPE,
        };
        const wrapper = mount(<AktiviteskortPeriodeVisning aktivitet={aktivitet} />);
        expect(wrapper.text()).toEqual('17. aug 2017 - 20. aug 2017');
    });
});
