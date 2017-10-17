/* eslint-env mocha */
import * as malSelector from './moduler/mal/mal-selector';
import * as situasjonSelector from './moduler/situasjon/situasjon-selector';
import reducer from './reducer';

const initialState = reducer(undefined, {
    type: '',
});
// const initialStateString = JSON.stringify(initialState);

function selectorModulTest(selectorModul) {
    Object.keys(selectorModul).forEach(selectorKey => {
        describe(selectorKey, () => {
            const selector = selectorModul[selectorKey];

            it('Skal fungere med initial state', () => {
                selector(initialState);
            });
        });
    });
}

selectorModulTest(malSelector);
selectorModulTest(situasjonSelector);
