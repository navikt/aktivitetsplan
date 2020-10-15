/* eslint-env mocha */
import { createActionsAndReducer } from './rest-reducer';

const { reducer, actionTypes, selectData, selectStatus } = createActionsAndReducer('test');

describe('rest-reducer', () => {
    describe('reducer metode', () => {
        describe('med action type pending', () => {
            it('skal sette status til pending når type er pending', () => {
                const result = reducer(undefined, {
                    type: actionTypes.PENDING,
                });
                expect(result).toHaveProperty('status', 'PENDING');
            });
            it('skal sette status til reloading når det finnes eksisterende state', () => {
                const result = reducer(
                    { data: { test: 'This is fine' }, status: 'OK' },
                    {
                        type: actionTypes.PENDING,
                    }
                );
                expect(result).toEqual({
                    data: { test: 'This is fine' },
                    status: 'RELOADING',
                });
            });
        });
        describe('med action type ok', () => {
            it('skal sette status ok med tom store', () => {
                const result = reducer(undefined, {
                    type: actionTypes.OK,
                    data: { test: 'This is fine.' },
                });
                expect(result).toHaveProperty('status', 'OK');
            });
            it('skal sette status ok og overskrive data i store med eksistrende data på samme path', () => {
                const result = reducer(
                    { data: { test: 'This is fine.' }, status: 'OK' },
                    {
                        type: actionTypes.OK,
                        data: { test: 42 },
                    }
                );
                expect(result).toEqual({
                    data: { test: 42 },
                    status: 'OK',
                });
            });
        });
        describe('med action type feilet', () => {
            it('skal sette status feilet', () => {
                const result = reducer(undefined, {
                    type: actionTypes.FEILET,
                    data: { test: 42 },
                });
                expect(result).toHaveProperty('status', 'ERROR');
            });
            it('skal sette status feilet med eksisterende state og beholde gammel data', () => {
                const result = reducer(
                    { data: { test: 'This is fine.' }, status: 'OK' },
                    {
                        type: actionTypes.FEILET,
                        data: { test: 42 },
                    }
                );
                expect(result).toEqual({
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

            expect(selectData(state)).toEqual('This is fine.');
            expect(selectStatus(state)).toEqual('OK');
        });
    });
});
