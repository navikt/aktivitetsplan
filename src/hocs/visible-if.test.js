import { mount } from 'enzyme';
/* eslint-env mocha */
import React from 'react';

import visibleIfHOC from './visible-if';

describe('visible-if', () => {
    it('Skal rendre hvis visible er true', () => {
        const Komp = visibleIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp visible={() => true} />);

        expect(wrapper.find('div').hasClass('test')).toBeTruthy();
    });

    it('Skal ikke rendre hvis visible er false', () => {
        const Komp = visibleIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp visible={() => false} />);

        expect(wrapper.find('div').length === 0).toBeTruthy();
    });

    it('Skal rendre hvis visible er undefined', () => {
        const Komp = visibleIfHOC(() => <div className="test" />);
        const wrapper = mount(<Komp visible={() => undefined} />);

        expect(wrapper.find('div').hasClass('test')).toBeTruthy();
    });
});
