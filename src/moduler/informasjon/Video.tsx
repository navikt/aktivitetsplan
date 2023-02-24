import { BodyShort, ReadMore } from '@navikt/ds-react';
import React from 'react';

const ONBOARDING_VIDEO_URL =
    'https://video.qbrick.com/play2/embed/player?accountId=763558&mediaId=74420478-00015227-993dea3a&configId=default&pageStyling=adaptive&autoplay=true&repeat=true&sharing=true';

const Video = () => {
    return (
        <div>
            <iframe title="onboarding-video" src={ONBOARDING_VIDEO_URL} className="pt-8 w-full h-300px" />
            <ReadMore header="Vis tekst for video" className="mt-4 pb-4 bg-transparent">
                <div className="flex flex-col gap-y-4">
                    <BodyShort>
                        For at du skal holde oversikt og vite hva som forventes av deg, og kunne samarbeide med
                        veilederen din, har vi laget en aktivitetsplan på nav.no
                    </BodyShort>
                    <BodyShort>
                        Aktivitetsplan er et verktøy du kan bruke for å komme deg ut i jobb, enten det er fort gjort
                        eller om det kreves litt mer langsiktig planlegging.
                    </BodyShort>
                    <BodyShort>
                        Du setter deg mål, lager planer og legger inn oppgaver du skal gjennomføre. Dette gjør du enkelt
                        på små kort som du kan dra og slippe, avhengig av hva du har gjort så langt.
                    </BodyShort>
                    <BodyShort>
                        Og det fine er, at du kan dele alt med veilederen din så dere sammen kan diskutere det neste
                        steget ditt. Du og veilederen din samarbeider om aktivitetsplanen når dere møtes, og hver for
                        dere. Dere kan diskutere kortene og du får varsling når du har fått svar.
                    </BodyShort>
                    <BodyShort>
                        Målet er at du skal få en jobb på den måten som passer best for deg og din situasjon.
                    </BodyShort>
                    <BodyShort>Lykke til!</BodyShort>
                </div>
            </ReadMore>
        </div>
    );
};

export default Video;
