/* eslint-env mocha */
import { expect } from 'chai';
import { deleteKeyFromObject } from './opprett-oppgave-utils';

describe('opprett-oppgave-utils', () => {
    it('skal slette key fra objekt', () => {
        const testObject = { a: 'a', b: 'b' };
        const expectedObject = { b: 'b' };

        expect(deleteKeyFromObject(testObject, 'a')).to.deep.equal(
            expectedObject
        );
    });
});
