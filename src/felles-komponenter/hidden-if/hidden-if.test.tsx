import { render } from '@testing-library/react';
import React from 'react';

import HiddenIfHOC from './hidden-if.tsx';

const Komp = ({ hidden }: { hidden: boolean | (() => boolean) }) => (
    <HiddenIfHOC hidden={hidden}>
        <div>test</div>
    </HiddenIfHOC>
);

describe('hidden-if', () => {
    it('Skal rendre hvis hidden er undefined', () => {
        const { getByText } = render(<Komp hidden={() => undefined} />);
        getByText('test');
    });

    it('Skal ikke rendre hvis hidden er true', () => {
        const { queryByText } = render(<Komp hidden={() => true} />);
        expect(queryByText('test')).toBeFalsy(); // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre hvis hidden er false', () => {
        const { getByText } = render(<Komp hidden={() => false} />);
        getByText('test');
    });
});
