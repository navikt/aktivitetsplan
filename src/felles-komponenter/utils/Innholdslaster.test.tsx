import { mount } from 'enzyme';
/* eslint-env mocha */
import React from 'react';

import { STATUS } from '../../api/utils';
import Innholdslaster, { Status } from './Innholdslaster';

describe('innholdslaster', () => {
    it('Skal rendre spinner hvis ikke alle avhengigheter har blitt lastet og det ikke er noen feil', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.PENDING as Status }]}>
                <div>yay</div>
            </Innholdslaster>
        );

        expect(wrapper.find('.spinner')).toBeDefined();
    });

    it('Skal ikke rendre children hvis det har oppstått en feil på noen avhengigheter', () => {
        const innhold = <div>yay</div>;
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.ERROR as Status }]}>{innhold}</Innholdslaster>
        );

        expect(wrapper.find(innhold)).toHaveLength(0);
    });

    it('Skal rendre children hvis alle avhengigheter har blitt lastet', () => {
        const innhold = <div>yay</div>;
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK as Status }]}>{innhold}</Innholdslaster>
        );

        expect(wrapper.find(innhold)).toBeDefined();
    });

    it('Skal rendre children som en funksjon, hvis det er en funksjon', () => {
        const innhold = <div>yay</div>;
        const renderDiv = () => innhold;
        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK as Status }]}>{renderDiv}</Innholdslaster>
        );

        expect(wrapper.find(innhold)).toBeDefined();
    });

    it('Skal ikke rendre children om noen av avhengighetene er ok, men andre har feilet', () => {
        const innhold = <div>yay</div>;

        const wrapper = mount(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK as Status }, { status: STATUS.ERROR as Status }]}>
                {innhold}
            </Innholdslaster>
        );

        expect(wrapper.find(innhold)).toHaveLength(0);
    });

    it('Takler både slices og statuser', () => {
        const innhold = <div>yay</div>;

        const wrapper = mount(
            <Innholdslaster
                avhengigheter={[
                    { status: STATUS.OK as Status },
                    STATUS.ERROR as Status,
                    { status: STATUS.OK as Status },
                ]}
            >
                {innhold}
            </Innholdslaster>
        );

        expect(wrapper.find(innhold)).toHaveLength(0);
    });

    it('Takler null og undefined', () => {
        const wrapper = mount(
            <Innholdslaster avhengigheter={[null, undefined, { status: STATUS.OK as Status }]}>
                <div>yay</div>
            </Innholdslaster>
        );

        expect(wrapper.find('.spinner')).toBeDefined();
    });
});
