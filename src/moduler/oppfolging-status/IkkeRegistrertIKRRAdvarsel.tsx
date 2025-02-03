import { Alert, Heading, Link } from '@navikt/ds-react';
import React from 'react';

const tekster = {
    bruker: {
        tittel: 'Vi har ikke din kontaktinformasjon',
        tekst: 'Du kan ikke bruke aktivitetsplanen fordi du ikke har registrert e-post eller telefonnummeret ditt i kontakt og reservasjonsregisteret (KRR).',
        lenkeTekst: 'Gå til norge.no for å registrere.',
    },
    veileder: {
        tittel: 'Brukeren er ikke registrert i KRR',
        tekst: 'Du kan ikke bruke aktivitetsplanen fordi brukeren ikke har registrert e-post eller telefonnummeret sitt i KRR',
        lenkeTekst: 'Brukeren må gå til norge.no for å registrere.',
    },
};

const linkIkkeIKrr = "https://www.norge.no/nb/digital-borger/oppdater-kontaktinformasjon"

export function IkkeRegistrertIKRRAdvarsel({
    erRegistrertIKRR,
    erVeileder,
}: {
    erRegistrertIKRR: boolean;
    erVeileder: boolean;
}) {
    if (erRegistrertIKRR) return null;
    const tekst = erVeileder ? tekster.veileder : tekster.bruker;
    return (
        <div className="flex items-center flex-col">
            <Alert variant="warning" className="mx-2 mt-6 max-w-2xl">
                <Heading spacing size="small" level="3">
                    {tekst.tittel}
                </Heading>
                <p>{tekst.tekst}</p>
                <Link href={linkIkkeIKrr}>{tekst.lenkeTekst}</Link>
            </Alert>
        </div>
    );
}
