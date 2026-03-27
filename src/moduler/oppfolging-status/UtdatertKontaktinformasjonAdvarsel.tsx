import { Alert, Heading, Link } from '@navikt/ds-react';
import React from 'react';

const tekster = {
    bruker: {
        tittel: 'Kontaktinformasjonen din er utdatert',
        tekst: 'Du kan ikke bruke aktivitetsplanen fordi kontaktinformasjonen din i kontakt- og reservasjonsregisteret (KRR) er utdatert.',
        lenkeTekst: 'Gå til norge.no for å oppdatere.',
    },
    veileder: {
        tittel: 'Brukerens kontaktinformasjon i KRR er utdatert',
        tekst: 'Du kan ikke bruke aktivitetsplanen fordi brukerens kontaktinformasjonen i kontakt- og reservasjonsregisteret (KRR) er utdatert',
        lenkeTekst: 'Brukeren må gå til norge.no for å oppdatere.',
    },
};

const oppdaterKrr = 'https://www.norge.no/nb/digital-borger/oppdater-kontaktinformasjon';

export function UtdatertKontaktinformasjonAdvarsel({
    utdatertIKRR,
    erVeileder,
}: {
    utdatertIKRR: boolean;
    erVeileder: boolean;
}) {
    if (!utdatertIKRR) return null;
    const tekst = erVeileder ? tekster.veileder : tekster.bruker;
    return (
        <div className="flex items-center flex-col">
            <Alert variant="warning" className="mx-2 mt-6 max-w-2xl">
                <Heading spacing size="small" level="3">
                    {tekst.tittel}
                </Heading>
                <p>{tekst.tekst}</p>
                <Link href={oppdaterKrr}>{tekst.lenkeTekst}</Link>
            </Alert>
        </div>
    );
}
