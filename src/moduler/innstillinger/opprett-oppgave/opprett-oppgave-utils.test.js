/* eslint-env mocha */
import { slettFeltFraObjekt } from './opprett-oppgave-utils';

describe('opprett-oppgave-utils', () => {
    it('skal slette key fra objekt', () => {
        const testObject = { a: 'a', b: 'b' };
        const expectedObject = { b: 'b' };

        expect(slettFeltFraObjekt(testObject, 'a')).toEqual(
            expectedObject
        );
    });
});
