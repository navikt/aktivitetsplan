/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';

import { IntlProvider } from 'react-intl';
import Spinner from 'nav-frontend-spinner';
import { STATUS } from '../../ducks/utils';
import Innholdslaster from './innholdslaster';

describe('innholdslaster', () => {
    it('Skal rendre spinner hvis ikke alle avhengigheter har blitt lastet og det ikke er noen feil', () => {
        const wrapper = shallow(
            <Innholdslaster avhengigheter={[{ status: STATUS.PENDING }]}>
                Children
            </Innholdslaster>
        );

        expect(wrapper.find('.spinner')).toHaveLength(1)
    });

    it('Skal ikke rendre children hvis det har oppstått en feil på noen avhengigheter', () => {
        const wrapper = shallow(
            <IntlProvider>
                <Innholdslaster avhengigheter={[{ status: STATUS.ERROR }]}>
                    Children
                </Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper.find('Children')).to.have.lengthOf(0);
    });

    it('Skal rendre children hvis alle avhengigheter har blitt lastet', () => {
        const wrapper = shallow(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK }]}>
                <div className="unik-klasse" />
            </Innholdslaster>
        );

        expect(wrapper.find('div').hasClass('unik-klasse')).toEqual(true);
    });

    it('Skal rendre children som en funksjon, hvis det er en funksjon', () => {
        const renderDiv = () => <div className="div-fra-func" />;
        const wrapper = shallow(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK }]}>
                {renderDiv}
            </Innholdslaster>
        );

        expect(wrapper.find('div').hasClass('div-fra-func')).toEqual(true);
    });

    it('Skal ikke rendre children om noen av avhengighetene er ok, men andre har feilet', () => {
        const wrapper = shallow(
            <IntlProvider>
                <Innholdslaster
                    avhengigheter={[
                        { status: STATUS.OK },
                        { status: STATUS.ERROR },
                    ]}
                >
                    Children
                </Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper.find('Children')).to.have.lengthOf(0);
    });

    it('Takler både slices og statuser', () => {
        const wrapper = shallow(
            <IntlProvider>
                <Innholdslaster
                    avhengigheter={[
                        { status: STATUS.OK },
                        STATUS.ERROR,
                        { status: STATUS.OK },
                    ]}
                >
                    Children
                </Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper.find('Children')).to.have.lengthOf(0);
    });

    it('Takler null og undefined', () => {
        const wrapper = shallow(
            <IntlProvider>
                <Innholdslaster
                    avhengigheter={[null, undefined, { status: STATUS.OK }]}
                >
                    Children
                </Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper).to.have.descendants(Spinner); // eslint-disable-line no-unused-expressions
    });
});
