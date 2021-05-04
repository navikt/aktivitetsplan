import { shallow } from 'enzyme';
/* eslint-env mocha */
import React from 'react';

import UnsafeHtml from './UnsafeHtml';

describe('unsafe-html', () => {
    it('Skal kunne rendre uten props', () => {
        const wrapper = shallow(<UnsafeHtml>Test</UnsafeHtml>);

        expect(wrapper.find('div').hasClass('unsafe-html')).toEqual(true);
    });

    it('Skal inkludere klasser som passes', () => {
        const wrapper = shallow(<UnsafeHtml className="test-klasse">Test</UnsafeHtml>);

        expect(wrapper.find('div').hasClass('unsafe-html test-klasse')).toEqual(true);
    });
});
