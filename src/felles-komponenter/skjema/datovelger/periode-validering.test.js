/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { PeriodeValideringPure } from './periode-validering';

const errorMessage = 'test:periodevalidering:error';

const testIntl = {
    formatMessage: props => props.id,
};

function lagPeriodeValidering(fradato, tildato) {
    return shallow(
        <PeriodeValideringPure
            feltNavn="test"
            errorMessageId={errorMessage}
            fraDato={fradato}
            tilDato={tildato}
            intl={testIntl}
        />
    );
}

describe('periodeValidering', () => {
    it('Skal ikke gi feilmelding om fradato er undefined og tildato satt', () => {
        const component = lagPeriodeValidering(
            undefined,
            new Date('2017-01-01')
        );
        expect(component.hasClass('skjema--harFeil')).to.equal(false);
    });

    it('Skal ikke gi feilmelding om tildato er undefined og fradato satt', () => {
        const component = lagPeriodeValidering(
            new Date('2017-01-01'),
            undefined
        );
        expect(component.hasClass('skjema--harFeil')).to.equal(false);
    });

    it('Skal ikke gi feilmelding om tildato og fradato er samme dag', () => {
        const component = lagPeriodeValidering(
            new Date('2017-01-01'),
            new Date('2017-01-01')
        );
        expect(component.hasClass('skjema--harFeil')).to.equal(false);
    });

    it('Skal ikke gi feilmelding om fradato er før tildato', () => {
        const component = lagPeriodeValidering(
            new Date('2017-01-01'),
            new Date('2017-02-02')
        );
        expect(component.hasClass('skjema--harFeil')).to.equal(false);
    });

    it('Skal gi feilmelding om tildato er før fradato', () => {
        const component = lagPeriodeValidering(
            new Date('2017-02-02'),
            new Date('2017-01-01')
        );
        expect(component.hasClass('skjema--harFeil')).to.equal(true);
    });
});
