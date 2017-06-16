/* eslint-env mocha */
import React from 'react';

import { mount } from 'enzyme';
import { expect } from 'chai';
import hiddenIfHOC from './hidden-if';

describe('hidden-if', () => {
    it('Skal rendre hvis hidden er undefined', () => {
        const Komp = hiddenIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp hidden={() => undefined} />);

        expect(wrapper.find('div').hasClass('test')).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('Skal ikke rendre hvis hidden er true', () => {
        const Komp = hiddenIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp hidden={() => true} />);

        expect(wrapper.find('div').length === 0).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre hvis hidden er false', () => {
        const Komp = hiddenIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp hidden={() => false} />);

        expect(wrapper.find('div').hasClass('test')).to.be.true; // eslint-disable-line no-unused-expressions
    });
});
