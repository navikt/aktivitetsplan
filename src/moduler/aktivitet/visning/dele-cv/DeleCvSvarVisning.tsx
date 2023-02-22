import { Alert, BodyShort } from '@navikt/ds-react';
import React, { useState } from 'react';

import { CvKanDelesData } from '../../../../datatypes/internAktivitetTypes';
import EkspanderbarLinjeBase from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinjeBase';
import { formaterDatoManed } from '../../../../utils';
import { Ingress } from './DeleCvContainer';
import styles from './DeleCvSvarVisning.module.less';
import { JaSvarTekst, NeiSvarTekst, overskrift } from './tekster';

interface Props {
    cvKanDelesData: CvKanDelesData;
    startAapen?: boolean;
}

export const DeleCvSvarVisning = ({ cvKanDelesData, startAapen = false }: Props) => {
    const [erAapen, setAapen] = useState(startAapen);
    const toggle = () => setAapen(!erAapen);

    const cvKanDeles = cvKanDelesData.kanDeles;

    const Tittel = () => <BodyShort className={styles.deleCVEndreTittel}>{overskrift}</BodyShort>;
    const TittelMedCvSvar = () => (
        <>
            <Tittel />
            <BodyShort className={styles.deleCVTittelSvarTekst}>{cvKanDeles ? 'Ja' : 'Nei'}</BodyShort>
        </>
    );

    const Infostripe = () =>
        cvKanDeles ? (
            <Alert variant="info" className="mt-4">
                Arbeidsgiveren eller NAV vil kontakte deg hvis du er aktuell for stillingen
            </Alert>
        ) : null;

    var svarTekst: string, endretTekst: string;
    if (cvKanDelesData.endretAvType === 'BRUKER') {
        svarTekst = cvKanDeles ? JaSvarTekst : NeiSvarTekst;
        endretTekst = `Du svarte ${formaterDatoManed(cvKanDelesData.endretTidspunkt)}`;
    } else {
        svarTekst = `NAV var i kontakt med deg ${formaterDatoManed(cvKanDelesData.avtaltDato)}. Du sa ${
            cvKanDeles ? 'ja' : 'nei'
        } til at CV-en din deles med arbeidsgiver.`;
        endretTekst = `NAV svarte på vegne av deg ${formaterDatoManed(cvKanDelesData.endretTidspunkt)}.`;
    }

    return (
        <EkspanderbarLinjeBase
            tittel={<TittelMedCvSvar />}
            aapneTittel={<Tittel />}
            kanToogle
            aapneTekst="Åpne"
            lukkeTekst="Lukk"
            erAapen={erAapen}
            onClick={toggle}
        >
            <Ingress />
            <BodyShort className={styles.deleCVSvarTekst}>{svarTekst}</BodyShort>
            <BodyShort className={styles.endretTidspunkt}>{endretTekst}</BodyShort>
            <Infostripe />
        </EkspanderbarLinjeBase>
    );
};
