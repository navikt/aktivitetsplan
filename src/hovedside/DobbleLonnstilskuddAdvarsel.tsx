import { Alert, Heading } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter } from '../datatypes/aktivitetTypes';
import { EksternAktivitetType, VeilarbAktivitetType } from '../datatypes/internAktivitetTypes';
import { selectAktiviterForAktuellePerioden } from '../moduler/aktivitet/aktivitetlisteSelector';

const erLonnstilskudd = (aktivitet: AlleAktiviteter): boolean => {
    return (
        aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE &&
        (aktivitet.eksternAktivitet.type === EksternAktivitetType.MIDL_LONNSTILSKUDD_TYPE ||
            aktivitet.eksternAktivitet.type === EksternAktivitetType.VARIG_LONNSTILSKUDD_TYPE)
    );
};

const DobbleLonnstilskuddAdvarsel = () => {
    const harLonnstilskudd = useSelector(selectAktiviterForAktuellePerioden).some(erLonnstilskudd);

    if (!harLonnstilskudd) {
        return null;
    }

    return (
        <Alert className="mb-3" variant="warning" title={'Vi opplever en teknisk feil i aktivitetsplanen'}>
            <Heading spacing size="small" level="2">
                Lønnstilskudd kan dukke opp flere ganger i aktivitetsplanen din
            </Heading>
            <p>
                Vi erstatter nå det gamle systemet for varig og midlertidig lønnstilskudd med et nytt system. Fordi vi
                bytter system kan samme lønnstilskudd dukke opp to ganger i aktivitetsplanen din.
            </p>
            <p>Du fortsetter å få pengene dine som før, og du trenger ikke å gjøre noe.</p>
        </Alert>
    );
};

export default DobbleLonnstilskuddAdvarsel;
