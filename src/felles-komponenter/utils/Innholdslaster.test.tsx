import { render } from '@testing-library/react';
/* eslint-env mocha */
import React from 'react';

import { STATUS } from '../../api/utils';
import Innholdslaster, { Status } from './Innholdslaster';

describe('innholdslaster', () => {
    it('Skal rendre spinner hvis ikke alle avhengigheter har blitt lastet og det ikke er noen feil', () => {
        const { queryByText } = render(
            <Innholdslaster avhengigheter={[{ status: STATUS.PENDING as Status }]}>
                <div>yay</div>
            </Innholdslaster>
        );

        expect(queryByText('yay')).toBeFalsy();
    });

    it('Skal ikke rendre children hvis det har oppstått en feil på noen avhengigheter', () => {
        const innhold = <div>yay</div>;
        const { queryByText } = render(
            <Innholdslaster avhengigheter={[{ status: STATUS.ERROR as Status }]}>{innhold}</Innholdslaster>
        );

        expect(queryByText('yay')).toBeFalsy();
    });

    it('Skal rendre children hvis alle avhengigheter har blitt lastet', () => {
        const innhold = <div>yay</div>;
        const { getByText } = render(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK as Status }]}>{innhold}</Innholdslaster>
        );
        getByText('yay');
    });

    it('Skal rendre children som en funksjon, hvis det er en funksjon', () => {
        const innhold = <div>yay</div>;
        const renderDiv = () => innhold;
        const { getByText } = render(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK as Status }]}>{renderDiv}</Innholdslaster>
        );
        getByText('yay');
    });

    it('Skal ikke rendre children om noen av avhengighetene er ok, men andre har feilet', () => {
        const innhold = <div>yay</div>;

        const { queryByText } = render(
            <Innholdslaster avhengigheter={[{ status: STATUS.OK as Status }, { status: STATUS.ERROR as Status }]}>
                {innhold}
            </Innholdslaster>
        );

        expect(queryByText('yay')).toBeFalsy();
    });

    it('Takler både slices og statuser', () => {
        const innhold = <div>yay</div>;

        const { queryByText } = render(
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

        expect(queryByText('yay')).toBeFalsy();
    });

    it('Takler null og undefined', () => {
        const { queryByText } = render(
            <Innholdslaster avhengigheter={[null, undefined, { status: STATUS.OK as Status }]}>
                <div>yay</div>
            </Innholdslaster>
        );
        expect(queryByText('yay')).toBeDefined();
    });
});
