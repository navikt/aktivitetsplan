import { validerPeriode } from './periode-validering';

describe('validerPeriode', () => {
    it('Skal ikke gi feilmelding om fradato er undefined og tildato satt', () => {
        const valid = validerPeriode(undefined, new Date('2017-01-01'));
        expect(valid).toBeTruthy();
    });

    it('Skal ikke gi feilmelding om tildato er undefined og fradato satt', () => {
        const valid = validerPeriode(new Date('2017-01-01'), undefined);
        expect(valid).toBeTruthy();
    });

    it('Skal ikke gi feilmelding om tildato og fradato er samme dag', () => {
        const valid = validerPeriode(
            new Date('2017-01-01'),
            new Date('2017-01-01')
        );
        expect(valid).toBeTruthy();
    });

    it('Skal ikke gi feilmelding om fradato er før tildato', () => {
        const valid = validerPeriode(
            new Date('2017-01-01'),
            new Date('2017-02-02')
        );
        expect(valid).toBeTruthy();
    });

    it('Skal gi feilmelding om tildato er før fradato', () => {
        const valid = validerPeriode(
            new Date('2017-02-02'),
            new Date('2017-01-01')
        );
        expect(valid).toBeFalsy()
    });
});
