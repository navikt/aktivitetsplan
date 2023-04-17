import { render } from '@testing-library/react';
/* eslint-env mocha */
import React from 'react';

import { Status } from '../../createGenericSlice';
import Innholdslaster from './Innholdslaster';

describe('innholdslaster', () => {
    it('Skal rendre spinner hvis ikke alle avhengigheter har blitt lastet og det ikke er noen feil', () => {
        const { queryByText } = render(
            <Innholdslaster avhengigheter={[{ status: Status.PENDING as Status }]}>
                <div>yay</div>
            </Innholdslaster>
        );

        expect(queryByText('yay')).toBeFalsy();
    });

    it('Skal ikke rendre children hvis det har oppstått en feil på noen avhengigheter', () => {
        const innhold = <div>yay</div>;
        const { queryByText } = render(
            <Innholdslaster avhengigheter={[{ status: Status.ERROR as Status }]}>{innhold}</Innholdslaster>
        );

        expect(queryByText('yay')).toBeFalsy();
    });

    it('Skal rendre children hvis alle avhengigheter har blitt lastet', () => {
        const innhold = <div>yay</div>;
        const { getByText } = render(
            <Innholdslaster avhengigheter={[{ status: Status.OK as Status }]}>{innhold}</Innholdslaster>
        );
        getByText('yay');
    });

    it('Skal rendre children som en funksjon, hvis det er en funksjon', () => {
        const innhold = <div>yay</div>;
        const renderDiv = () => innhold;
        const { getByText } = render(
            <Innholdslaster avhengigheter={[{ status: Status.OK as Status }]}>{renderDiv}</Innholdslaster>
        );
        getByText('yay');
    });

    it('Skal ikke rendre children om noen av avhengighetene er ok, men andre har feilet', () => {
        const innhold = <div>yay</div>;

        const { queryByText } = render(
            <Innholdslaster avhengigheter={[{ status: Status.OK as Status }, { status: Status.ERROR as Status }]}>
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
                    { status: Status.OK as Status },
                    Status.ERROR as Status,
                    { status: Status.OK as Status },
                ]}
            >
                {innhold}
            </Innholdslaster>
        );

        expect(queryByText('yay')).toBeFalsy();
    });

    it('Takler null og undefined', () => {
        const { queryByText } = render(
            <Innholdslaster avhengigheter={[null, undefined, { status: Status.OK as Status }]}>
                <div>yay</div>
            </Innholdslaster>
        );
        expect(queryByText('yay')).toBeDefined();
    });
});
