import React from 'react';
import { FormattedMessage } from 'react-intl';
import { rules } from 'react-redux-form-validation';

function hvisIkkeFabrikk(valideringsfunksjon) {
    return predikat => (...args) => {
        if (predikat(...args)) {
            return undefined;
        }
        return valideringsfunksjon(...args);
    };
}

function pakrevdFabrikk(errorMessageId) {
    return feltVerdi => {
        if (feltVerdi) {
            return undefined;
        }
        return <FormattedMessage id={errorMessageId} />;
    };
}

function leggTilDSL(valideringsFabrikkFunksjon) {
    return (...args) => {
        const valideringsfunksjon = valideringsFabrikkFunksjon(...args);

        valideringsfunksjon.hvisIkke = leggTilDSL(
            hvisIkkeFabrikk(valideringsfunksjon)
        );

        return valideringsfunksjon;
    };
}

export const pakrevd = leggTilDSL(pakrevdFabrikk);

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
