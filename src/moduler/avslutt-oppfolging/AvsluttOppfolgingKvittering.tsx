import { Alert, Link, VStack } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import { MINSIDE_URL } from '../../constant';

export const AvsluttOppfolgingKvittering = () => {
    const alertRef = useRef<HTMLDivElement>(null);

    // Flytter fokus til kvitteringen slik at skjermlesere får med seg at skjemaet er byttet ut
    useEffect(() => {
        alertRef.current?.focus();
    }, []);

    return (
        <VStack gap="space-64" align="center">
            <Alert variant="success" ref={alertRef} tabIndex={-1}>
                Avslutningen av arbeidsrettet oppfølging var vellykket.
            </Alert>
            <Link href={MINSIDE_URL}>Gå til Min side</Link>
        </VStack>
    );
};
