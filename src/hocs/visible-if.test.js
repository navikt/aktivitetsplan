/* eslint-env mocha */
import React from 'react';

import { mount } from 'enzyme';
import { expect } from 'chai';
import visibleIfHOC from './visible-if';

describe('visible-if', () => {
    it('Skal rendre hvis visible er true', () => {
        const Komp = visibleIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp visible={() => true} />);

        expect(wrapper.find('div').hasClass('test')).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('Skal ikke rendre hvis visible er false', () => {
        const Komp = visibleIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp visible={() => false} />);

        expect(wrapper.find('div').length === 0).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre hvis visible er undefined', () => {
        const Komp = visibleIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp visible={() => undefined} />);

        expect(wrapper.find('div').hasClass('test')).to.be.true; // eslint-disable-line no-unused-expressions
    });
});
