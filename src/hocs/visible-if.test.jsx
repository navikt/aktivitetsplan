import { render } from '@testing-library/react';
/* eslint-env mocha */
import React from 'react';

import visibleIfHOC from './visible-if';

describe('visible-if', () => {
    it('Skal rendre hvis visible er true', () => {
        const Komp = visibleIfHOC(() => <div>test</div>);
        const { getByText } = render(<Komp visible={() => true} />);
        getByText('test');
    });

    it('Skal ikke rendre hvis visible er false', () => {
        const Komp = visibleIfHOC(() => <div>test</div>);
        const { queryByText } = render(<Komp visible={() => false} />);
        expect(queryByText('test')).toBeFalsy();
    });

    it('Skal rendre hvis visible er undefined', () => {
        const Komp = visibleIfHOC(() => <div>test</div>);
        const { getByText } = render(<Komp visible={() => undefined} />);
        getByText('test');
    });
});
