import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

export function BrukePlanenPanel() {
    return (
        <Ekspanderbartpanel tittel="Slik bruker du planen" tittelProps="undertittel">
            <p>
                Det første du bør gjøre er å bestemme deg for hva som er målet ditt. Tenk over hvilke jobber du kan
                trives i og som du tror passer for deg. Når du har definert et mål, kan du vurdere hvilke aktiviteter
                som må til for at du skal nå dette målet. Eksempler på aktiviteter kan være å søke jobber, kortere kurs
                og arbeidstrening. Aktivitetsplanen skal hjelpe deg med å strukturere og holde oversikt over
                aktivitetene dine.
            </p>
            <p>
                Aktivitetsplanen er delt inn i fem kolonner med statusene forslag, planlegger, gjennomfører, fullført og
                avbrutt. Du flytter en aktivitet fra en kolonne til en annen ved å dra og slippe aktiviteten, eller ved
                å velge status inne i aktiviteten. På denne måten viser du fremdriften i aktivitetene du skal
                gjennomføre.
            </p>
            <p>
                Du kan selv legge inn aktiviteter i planen. NAV kan også foreslå aktiviteter for deg som du selv velger
                om du vil gjennomføre. I tillegg kan veilederen din legge til aktiviteter som du er forpliktet til å
                gjennomføre. Disse aktivitetene vil ha en blå etikett som heter «Avtalt med NAV». Du kan ikke gjøre
                endringer i slike aktiviteter. Hvis du er uenig i at en aktivitet er merket som avtalt, kan du skrive i
                dialogen og forklare hvorfor du er uenig.
            </p>
            <p>
                Noen ganger vil aktivitetene være merket med en blå prikk. Det betyr at veilederen din har gjort en
                endring.
            </p>
        </Ekspanderbartpanel>
    );
}
