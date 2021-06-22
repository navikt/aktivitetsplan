import Tekstomrade from 'nav-frontend-tekstomrade';
import React from 'react';

import { AktivitetType } from '../../../../datatypes/aktivitetTypes';

const aktivitetingress = {
    BEHANDLING:
        'Her kan du legge inn medisinsk behandling som påvirker muligheten din til å jobbe eller være på kurs og tiltak.\n\n' +
        'Eksempler:\n' +
        '- Oppfølging hos fastlege\n' +
        '- Behandling og veiledning hos fysioterapaut\n' +
        '- Behandling hos psykolog\n' +
        '- Behandling hos spesialist\n',
    EGEN:
        'Her kan du eller veilederen din legge inn aktiviteter som hjelper deg når du skal komme i arbeid. ' +
        'Eksempler kan være å registrere deg hos bemannings- og rekrutteringsbyråer, jobbe godt med CV-en, ' +
        'eller lage oversikt over personer som kan være nyttig å kontakte når du er på jakt etter jobb.',
    GRUPPEAKTIVITET: 'Her ser du informasjon om en gruppeaktivitet NAV har meldt deg på',
    IJOBB: 'Her kan du informere om der du jobber nå, for eksempel en deltidsjobb eller en midlertidig stilling. Hvis du sender inn meldekort, så må du også huske å føre opp de timene du har jobbet på meldekortet.',
    MOTE: 'NAV ønsker et møte med deg. Du må gi beskjed så raskt som mulig hvis tidspunktet ikke passer.',
    SAMTALEREFERAT: 'Her finner du referat fra en samtale du har hatt med NAV.',
    SOKEAVTALE:
        'Her ser du hvor mange jobber NAV forventer at du søker. Legg inn stillinger du søker på i aktivitetsplanen ved å klikke på "Legg til aktivitet".\t',
    STILLING:
        'Her kan du legge til informasjon om en stilling du har lyst å søke på. Du kan også legge til en stilling du allerede har søkt på.',
    TILTAKSAKTIVITET: 'Her finner du informasjon om et tiltak NAV har søkt deg inn på. ',
    UTDANNINGSAKTIVITET:
        'Her ser du informasjon om en utdanningsaktivitet eller et kurs NAV har registrert at du skal gjennomføre.',
    STILLING_FRA_NAV:
        'NAV hjelper en arbeidsgiver med å finne kandidater til en stilling, og tror den kan passe for deg.',
};

type Props = {
    aktivitetstype: AktivitetType;
};

function AktivitetIngress({ aktivitetstype }: Props) {
    return (
        <section className="aktivitetingress">
            <Tekstomrade className="aktivitetingress__tekst">{aktivitetingress[aktivitetstype]}</Tekstomrade>
        </section>
    );
}

export default AktivitetIngress;
