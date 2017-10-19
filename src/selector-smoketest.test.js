/* eslint-env mocha */
import { expect } from 'chai';
import * as malSelector from './moduler/mal/mal-selector';
import * as oppfolgingSelector from './moduler/oppfolging/oppfolging-selector';
import * as identitetSelector from './moduler/identitet/identitet-selector';
import * as dialogSelector from './moduler/dialog/dialog-selector';
import * as brukerSelector from './moduler/bruker/bruker-selector';
import * as arenaAktivitetSelector from './moduler/aktivitet/arena-aktivitet-selector';
import * as aktivitetSelector from './moduler/aktivitet/aktivitet-selector';
import * as aktivitetListeSelector from './moduler/aktivitet/aktivitetliste-selector';
import * as arbeidsListeSelector from './moduler/arbeidsliste/arbeidsliste-selector';
import * as innstillningerSelector from './moduler/innstillinger/innstillinger-selector';
import * as utsktriftSelector from './moduler/utskrift/utskrift-selector';
import * as privatModusSelector from './moduler/privat-modus/privat-modus-selector';
import * as motpartSelector from './moduler/motpart/motpart-selector';
import reducer from './reducer';

const initialState = reducer(undefined, {
    type: '',
});

const initialStateString = JSON.stringify(initialState);

function selectorModulTest(selectorModul) {
    Object.keys(selectorModul).forEach(selectorKey => {
        describe(selectorKey, () => {
            const selector = selectorModul[selectorKey];

            it('Skal fungere med initial state', () => {
                selector(initialState);
            });

            it('Skal ikke ha sideffekter', () => {
                expect(initialStateString).to.equal(
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
selectorModulTest(arbeidsListeSelector);
selectorModulTest(innstillningerSelector);
selectorModulTest(utsktriftSelector);
selectorModulTest(privatModusSelector);
selectorModulTest(motpartSelector);
