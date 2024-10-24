import { BodyShort } from '@navikt/ds-react';
import React, { ReactElement } from 'react';

import { AktivitetType } from '../../../../datatypes/aktivitetTypes';
import CustomBodyLong from '../hjelpekomponenter/CustomBodyLong';

const aktivitetingress: Record<AktivitetType, string | ReactElement | undefined> = {
    BEHANDLING: (
        <div className="mt-4 space-y-4">

            <BodyShort>
                Her kan du legge inn medisinsk behandling som påvirker muligheten din til å jobbe eller være på kurs og
                tiltak.
            </BodyShort>
            <BodyShort>Eksempler:</BodyShort>
            <ul className="list-disc ml-4">
                <li>Oppfølging hos fastlege</li>
                <li>Behandling og veiledning hos fysioterapeut</li>
                <li>Behandling hos psykolog</li>
                <li> Behandling hos spesialist</li>
            </ul>
        </div>
    ),
    EGEN:
        'Her kan du eller veilederen din legge inn aktiviteter som hjelper deg når du skal komme i arbeid. ' +
        'Eksempler kan være å registrere deg hos bemannings- og rekrutteringsbyråer, jobbe godt med CV-en, ' +
        'eller lage oversikt over personer som kan være nyttig å kontakte når du er på jakt etter jobb.',
    GRUPPEAKTIVITET: 'Her ser du informasjon om en gruppeaktivitet Nav har meldt deg på',
    IJOBB: 'Her kan du informere om der du jobber nå, for eksempel en deltidsjobb eller en midlertidig stilling. Hvis du sender inn meldekort, så må du også huske å føre opp de timene du har jobbet på meldekortet.',
    MOTE: 'Nav ønsker et møte med deg. Du må gi beskjed så raskt som mulig hvis tidspunktet ikke passer.',
    SAMTALEREFERAT: 'Her finner du referat fra en samtale du har hatt med Nav.',
    SOKEAVTALE:
        'Her ser du hvor mange jobber Nav forventer at du søker. Legg inn stillinger du søker på i aktivitetsplanen ved å klikke på "Legg til aktivitet".\t',
    STILLING:
        'Her kan du legge til informasjon om en stilling du har lyst å søke på. Du kan også legge til en stilling du allerede har søkt på.',
    TILTAKSAKTIVITET: 'Her finner du informasjon om et tiltak Nav har søkt deg inn på. ',
    UTDANNINGSAKTIVITET:
        'Her ser du informasjon om en utdanningsaktivitet eller et kurs Nav har registrert at du skal gjennomføre.',
    STILLING_FRA_NAV:
        'Nav hjelper en arbeidsgiver med å finne kandidater til en stilling, og tror den kan passe for deg.',
    EKSTERNAKTIVITET: undefined,
};

type Props = {
    aktivitetstype: AktivitetType;
};

const AktivitetIngress = ({ aktivitetstype }: Props) => {
    const content = aktivitetingress[aktivitetstype];
    if (!content) return null;
    if (typeof content === 'string') {
        return (
            <section className="aktivitetingress mt-4">
                <CustomBodyLong className="aktivitetingress__tekst">{content}</CustomBodyLong>
            </section>
        );
    }

    return <section>{content}</section>;
};

export default AktivitetIngress;
