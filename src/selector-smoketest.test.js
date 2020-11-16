import * as aktivitetSelector from './moduler/aktivitet/aktivitet-selector';
import * as aktivitetListeSelector from './moduler/aktivitet/aktivitetliste-selector';
import * as arenaAktivitetSelector from './moduler/aktivitet/arena-aktivitet-selector';
import * as brukerSelector from './moduler/bruker/bruker-selector';
import * as dialogSelector from './moduler/dialog/dialog-selector';
import * as identitetSelector from './moduler/identitet/identitet-selector';
/* eslint-env mocha */
import * as malSelector from './moduler/mal/aktivitetsmal-selector';
import * as motpartSelector from './moduler/motpart/motpart-selector';
import * as oppfolgingSelector from './moduler/oppfolging-status/oppfolging-selector';
import reducer from './reducer';

const initialState = reducer(undefined, {
    type: '',
});

const initialStateString = JSON.stringify(initialState);

function selectorModulTest(selectorModul) {
    Object.keys(selectorModul).forEach((selectorKey) => {
        describe(selectorKey, () => {
            const selector = selectorModul[selectorKey];

            it('Skal fungere med initial state', () => {
                selector(initialState);
            });

            it('Skal ikke ha sideffekter', () => {
                expect(initialStateString).toEqual(
                    JSON.stringify(
                        reducer(undefined, {
                            type: '',
                        })
                    )
                );
            });
        });
    });
}

selectorModulTest(malSelector);
selectorModulTest(oppfolgingSelector);
selectorModulTest(identitetSelector);
selectorModulTest(dialogSelector);
selectorModulTest(brukerSelector);
selectorModulTest(arenaAktivitetSelector);
selectorModulTest(aktivitetSelector);
selectorModulTest(aktivitetListeSelector);
selectorModulTest(motpartSelector);
