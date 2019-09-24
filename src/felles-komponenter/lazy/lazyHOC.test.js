/* eslint-env mocha */
import React from 'react';

import { mount } from 'enzyme';
import lazyHOC from './lazyHOC';

describe('lazy-hoc', () => {
    function FeilendeKompoment() {
        throw new Error('Feil!');
    }

    function UtenBarn(props) {
        return <div {...props}>ingen barn</div>;
    }

    it('Skal rendre komponent', () => {
        const LazyDiv = lazyHOC(() => <div className="test" />);
        const wrapper = mount(<LazyDiv hidden={() => undefined} />);

        expect(wrapper.find('div').hasClass('test')).toBeTruthy();
    });

    it('Skal rendre feilende komponent', () => {
        const LazyFeilende = lazyHOC(() => <FeilendeKompoment />);
        expect(() => mount(<LazyFeilende />)).toThrow('Feil!');
    });

    it('Skal rendre komponent lazy', () => {
        const Komp = lazyHOC(() => (
            <UtenBarn className="test">
                <FeilendeKompoment />
            </UtenBarn>
        ));
        const wrapper = mount(<Komp />);

        expect(wrapper.find('div').hasClass('test')).toBeTruthy();
    });
});
