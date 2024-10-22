import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';

import { CvKanDelesData } from '../../../../datatypes/internAktivitetTypes';
import { formaterDatoManed } from '../../../../utils/dateUtils';
import { JaSvarTekst, NeiSvarTekst } from './tekster';

interface Props {
    cvKanDelesData: CvKanDelesData;
}

export const DeleCvSvarVisning = ({ cvKanDelesData }: Props) => {
    const cvKanDeles = cvKanDelesData.kanDeles;

    let svarTekst: string, endretTekst: string;
    if (cvKanDelesData.endretAvType === 'BRUKER') {
        svarTekst = cvKanDeles ? JaSvarTekst : NeiSvarTekst;
        endretTekst = `Du svarte ${formaterDatoManed(cvKanDelesData.endretTidspunkt)}`;
    } else {
        svarTekst = `Nav var i kontakt med deg ${formaterDatoManed(cvKanDelesData.avtaltDato)}. Du sa ${
            cvKanDeles ? 'ja' : 'nei'
        } til at CV-en din deles med arbeidsgiver.`;
        endretTekst = `Nav svarte på vegne av deg ${formaterDatoManed(cvKanDelesData.endretTidspunkt)}.`;
    }

    return (
        <div className="p-4 bg-surface-subtle border-border-default border rounded-md">
            <Heading size="medium" className="mb-4">
                {cvKanDeles ? 'Du svarte at du er interessert' : 'Du svarte at du ikke er interessert'}
            </Heading>
            <BodyShort>{svarTekst}</BodyShort>
            <BodyShort className="mt-4">{endretTekst}</BodyShort>
            {cvKanDeles ? (
                <BodyShort className="mt-4">
                    Arbeidsgiveren eller NAV vil kontakte deg hvis du er aktuell for stillingen
                </BodyShort>
            ) : null}
        </div>
    );
};
