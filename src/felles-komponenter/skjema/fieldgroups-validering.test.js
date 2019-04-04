/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroupsValideringPure } from './fieldgroups-validering';

const errorMessage = 'test:periodevalidering:error';

const testIntl = {
    formatMessage: props => props.id,
};

function lagFieldGroupsValidering(valid) {
    return shallow(
        <FieldGroupsValideringPure
            feltNavn="test"
            errorMessageId={errorMessage}
            intl={testIntl}
            validate={() => valid}
        />
    );
}

describe('fieldGroupsValidering', () => {
    it('Skal gi feilmelding hvis valideringen ikke er satt', () => {
        const component = lagFieldGroupsValidering(undefined);
        expect(component.hasClass('skjema--harFeil')).toEqual(true);
    });

    it('Skal gi feilmelding hvis validering feiler', () => {
        const component = lagFieldGroupsValidering(false);
        expect(component.hasClass('skjema--harFeil')).toEqual(true);
    });

    it('Skal ikke gi feilmelding hvis valideringen sier ok', () => {
        const component = lagFieldGroupsValidering(true);
        expect(component.hasClass('skjema--harFeil')).toEqual(false);
    });
});
