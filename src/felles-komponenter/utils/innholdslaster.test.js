/* eslint-env mocha */
import React from 'react';
import { mount } from 'enzyme';

import { IntlProvider } from 'react-intl';
import { STATUS } from '../../ducks/utils';
import Innholdslaster from './innholdslaster';

describe('innholdslaster', () => {
    it('Skal rendre spinner hvis ikke alle avhengigheter har blitt lastet og det ikke er noen feil', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.PENDING }]}>
                <div>yay</div>
            </Innholdslaster>
        );

        expect(wrapper.find('.spinner')).toBeDefined();
    });

    it('Skal ikke rendre children hvis det har oppstått en feil på noen avhengigheter', () => {
        const innhold = <div>yay</div>;
        const wrapper = mount(
            <IntlProvider locale="nb">
                <Innholdslaster avhengigheter={[{ status: STATUS.ERROR }]}>{innhold}</Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper.find(innhold)).toHaveLength(0);
    });

    it('Skal rendre children hvis alle avhengigheter har blitt lastet', () => {
        const innhold = <div>yay</div>;
        const wrapper = mount(<Innholdslaster avhengigheter={[{ status: STATUS.OK }]}>{innhold}</Innholdslaster>);

        expect(wrapper.find(innhold)).toBeDefined();
    });

    it('Skal rendre children som en funksjon, hvis det er en funksjon', () => {
        const innhold = <div>yay</div>;
        const renderDiv = () => innhold;
        const wrapper = mount(<Innholdslaster avhengigheter={[{ status: STATUS.OK }]}>{renderDiv}</Innholdslaster>);

        expect(wrapper.find(innhold)).toBeDefined();
    });

    it('Skal ikke rendre children om noen av avhengighetene er ok, men andre har feilet', () => {
        const innhold = <div>yay</div>;

        const wrapper = mount(
            <IntlProvider locale="nb">
                <Innholdslaster avhengigheter={[{ status: STATUS.OK }, { status: STATUS.ERROR }]}>
                    {innhold}
                </Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper.find(innhold)).toHaveLength(0);
    });

    it('Takler både slices og statuser', () => {
        const innhold = <div>yay</div>;

        const wrapper = mount(
            <IntlProvider locale="nb">
                <Innholdslaster avhengigheter={[{ status: STATUS.OK }, STATUS.ERROR, { status: STATUS.OK }]}>
                    {innhold}
                </Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper.find(innhold)).toHaveLength(0);
    });

    it('Takler null og undefined', () => {
        const wrapper = mount(
            <IntlProvider locale="nb">
                <Innholdslaster avhengigheter={[null, undefined, { status: STATUS.OK }]}>
                    <div>yay</div>
                </Innholdslaster>
            </IntlProvider>
        );

        expect(wrapper.find('.spinner')).toBeDefined();
    });
});
