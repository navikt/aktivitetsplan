/* eslint-env mocha */
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { IntlProvider } from 'react-intl';
import Spinner from 'nav-frontend-spinner';
import { STATUS } from '../../ducks/utils';
import Innholdslaster from './innholdslaster';

describe('innholdslaster', () => {
    it('Skal rendre spinner hvis ikke alle avhengigheter har blitt lastet og det ikke er noen feil', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.PENDING }]}>
                Children
            </Innholdslaster>
        );

        expect(wrapper).to.have.descendants(Spinner); // eslint-disable-line no-unused-expressions
    });

    it('Skal ikke rendre children hvis det har oppstått en feil på noen avhengigheter', () => {
        const wrapper = mount(
            <IntlProvider>
                <Innholdslaster avhengigheter={[{ status: STATUS.ERROR }]}>
                    Children
                </Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper.find('Children')).to.not.exist; // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre children hvis alle avhengigheter har blitt lastet', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK }]}>
                <div className="unik-klasse" />
            </Innholdslaster>
        );

        expect(wrapper.find('div').hasClass('unik-klasse')).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre children som en funksjon, hvis det er en funksjon', () => {
        const renderDiv = () => <div className="div-fra-func" />;
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK }]}>
                {renderDiv}
            </Innholdslaster>
        );

        expect(wrapper.find('div').hasClass('div-fra-func')).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('Skal ikke rendre children om noen av avhengighetene er ok, men andre har feilet', () => {
        const wrapper = mount(
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

        expect(wrapper.find('Children')).to.not.exist; // eslint-disable-line no-unused-expressions
    });

    it('Takler både slices og statuser', () => {
        const wrapper = mount(
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

        expect(wrapper.find('Children')).to.not.exist; // eslint-disable-line no-unused-expressions
    });

    it('Takler null og undefined', () => {
        const wrapper = mount(
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
