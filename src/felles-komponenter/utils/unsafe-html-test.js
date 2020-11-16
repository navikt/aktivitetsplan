import { expect } from 'chai';
import { shallow } from 'enzyme';
/* eslint-env mocha */
import React from 'react';

import UnsafeHtml from './unsafe-html';

describe('unsafe-html', () => {
    it('Skal kunne rendre uten props', () => {
        const wrapper = shallow(<UnsafeHtml>Test</UnsafeHtml>);

        expect(wrapper.find('div').hasClass('unsafe-html')).to.equal(true);
    });

    it('Skal inkludere klasser som passes', () => {
        const wrapper = shallow(<UnsafeHtml className="test-klasse">Test</UnsafeHtml>);

        expect(wrapper.find('div').hasClass('unsafe-html test-klasse')).to.equal(true);
    });
});
