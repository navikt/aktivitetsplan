import { Alert, Heading, Link } from '@navikt/ds-react';
import React from 'react';

const linkIkkeIKrr = "https://www.norge.no/nb/digital-borger/oppdater-kontaktinformasjon"

export function IkkeRegistrertIKRRAdvarsel({
    erRegistrertIKRR,
}: {
    erRegistrertIKRR: boolean;
}) {
    if (erRegistrertIKRR) return null;
    return (
        <div className="flex items-center flex-col">
            <Alert variant="warning" className="mx-2 mt-6 max-w-2xl">
                <Heading spacing size="small" level="3">
                    Vi har ikke din kontaktinformasjon
                </Heading>
                <p>Du kan ikke bruke aktivitetsplanen fordi du ikke har registrert e-post eller telefonnummeret ditt i kontakt og reservasjonsregisteret (KRR).</p>
                <Link href={linkIkkeIKrr}>Gå til norge.no for å registrere.</Link>
            </Alert>
        </div>
    );
}
