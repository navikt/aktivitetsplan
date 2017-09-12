import React from 'react';
import { FormattedMessage } from 'react-intl';
import { rules } from 'react-redux-form-validation';

function leggTilDSL(valideringsFabrikkFunksjon) {
    return (...args) => {
        const valideringsfunksjon = valideringsFabrikkFunksjon.apply(
            this,
            args
        );

        valideringsfunksjon.hvisIkke = leggTilDSL(predikat => (...args2) => {
            if (predikat.apply(this, args2)) {
                return undefined;
            }
            return valideringsfunksjon.apply(this, args2);
        });

        return valideringsfunksjon;
    };
}

export const pakrevd = leggTilDSL(errorMessageId => feltVerdi => {
    if (feltVerdi) {
        return undefined;
    }
    return <FormattedMessage id={errorMessageId} />;
});

export const maksLengde = leggTilDSL((errorMessageId, maksimalLengde) =>
    rules.maxLength(
        maksimalLengde,
        <FormattedMessage
            id={errorMessageId}
            values={{
                maksLengde: maksimalLengde,
                MAKS_LENGDE: maksimalLengde,
            }}
        />
    )
);
