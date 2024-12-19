import { render } from '@testing-library/react';
import React from 'react';

import hiddenIfHOC, { div as HiddenIfDiv } from './hidden-if.tsx';

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

    it('Skal kunne styles', () => {
        const testClass = 'myClass';
        const { getByText } = render(
            <HiddenIfDiv className={testClass} hidden={false}>
                LOL
            </HiddenIfDiv>,
        );
        expect(getByText('LOL').className).toBe(testClass);
    });

    it('Skal ikke rendre hvis hidden er true', () => {
        const { queryByText } = render(<HiddenIfDiv hidden={true}>LOL</HiddenIfDiv>);
        expect(queryByText('LOL')).toBeFalsy();
    });

    it('Skal ikke rendre hvis hidden er () => true', () => {
        const { queryByText } = render(<HiddenIfDiv hidden={() => true}>LOL</HiddenIfDiv>);
        expect(queryByText('LOL')).toBeFalsy();
    });
});
