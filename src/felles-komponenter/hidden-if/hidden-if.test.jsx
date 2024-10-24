import { render } from '@testing-library/react';
import React from 'react';

import hiddenIfHOC from './hidden-if.js';

describe('hidden-if', () => {
    it('Skal rendre hvis hidden er undefined', () => {
        const Komp = hiddenIfHOC(() => <div>test</div>);
        const { getByText } = render(<Komp hidden={() => undefined} />);
        getByText('test');
    });

    it('Skal ikke rendre hvis hidden er true', () => {
        const Komp = hiddenIfHOC(() => <div>test</div>);
        const { queryByText } = render(<Komp hidden={() => true} />);
        expect(queryByText('test')).toBeFalsy(); // eslint-disable-line no-unused-expressions
    });

    it('Skal rendre hvis hidden er false', () => {
        const Komp = hiddenIfHOC(() => <div>test</div>);
        const { getByText } = render(<Komp hidden={() => false} />);
        getByText('test');
    });
});
