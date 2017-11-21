/* eslint-env mocha */
import { expect } from 'chai';
import { createActionsAndReducer } from './rest-reducer';

const {
    reducer,
    actionTypes,
    selectData,
    selectStatus,
} = createActionsAndReducer('test');

describe('rest-reducer', () => {
    describe('reducer metode', () => {
        describe('med action type pending', () => {
            it('skal sette status til pending når type er pending', () => {
                const result = reducer(undefined, {
                    type: actionTypes.PENDING,
                });
                expect(result).to.deep.equal({
                    data: {},
                    status: 'PENDING',
                });
            });
            it('skal sette type til reloading når det finnes eksisterende state', () => {
                const result = reducer(
                    { data: { test: 'This is fine.' }, status: 'OK' },
                    {
                        type: actionTypes.PENDING,
                    }
                );
                expect(result).to.deep.equal({
                    data: { test: 'This is fine.' },
                    status: 'RELOADING',
                });
            });
        });
        describe('med action type ok', () => {
            it('skal sette type ok med tom store', () => {
                const result = reducer(undefined, {
                    type: actionTypes.OK,
                    data: { test: 'This is fine.' },
                });
                expect(result).to.deep.equal({
                    data: { test: 'This is fine.' },
                    status: 'OK',
                });
            });
            it('skal sette type ok og overskrive data i store med eksistrende data på samme path', () => {
                const result = reducer(
                    { data: { test: 'This is fine.' }, status: 'OK' },
                    {
                        type: actionTypes.OK,
                        data: { test: 42 },
                    }
                );
                expect(result).to.deep.equal({
                    data: { test: 42 },
                    status: 'OK',
                });
            });
            it('skal sette type ok legge til data i store med eksistrende data på annen path', () => {
                const result = reducer(
                    { data2: { test: 'This is fine.' }, status: 'OK' },
                    {
                        type: actionTypes.OK,
                        data: { test: 42 },
                    }
                );
                expect(result).to.deep.equal({
                    data: { test: 42 },
                    data2: { test: 'This is fine.' },
                    status: 'OK',
                });
            });
        });
        describe('med action type feilet', () => {
            it('skal sette type feilet', () => {
                const result = reducer(undefined, {
                    type: actionTypes.FEILET,
                    data: { test: 42 },
                });
                expect(result).to.deep.equal({
                    data: {},
                    feil: { test: 42 },
                    status: 'ERROR',
                });
            });
            it('skal sette type feilet med eksisterende state og beholde gammel data', () => {
                const result = reducer(
                    { data: { test: 'This is fine.' }, status: 'OK' },
                    {
                        type: actionTypes.FEILET,
                        data: { test: 42 },
                    }
                );
                expect(result).to.deep.equal({
                    data: { test: 'This is fine.' },
                    feil: { test: 42 },
                    status: 'ERROR',
                });
            });
        });
    });
    describe('selectors', () => {
        it('skal hente data og status fra state', () => {
            const state = {
                data: {
                    test: {
                        data: 'This is fine.',
                        status: 'OK',
                    },
                },
            };

            expect(selectData(state)).to.deep.equal('This is fine.');
            expect(selectStatus(state)).to.equal('OK');
        });
    });
});
