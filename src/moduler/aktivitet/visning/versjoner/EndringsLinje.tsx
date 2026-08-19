import { BodyShort, Link as AkselLink } from '@navikt/ds-react';
import React from 'react';

import { formaterDatoEllerTidSiden } from '../../../../utils/dateUtils';
import { Endring } from '../../../../datatypes/Historikk';
import { useErVeileder } from '../../../../Provider';
import { Link } from 'react-router';
import { useRoutes } from '../../../../routing/useRoutes';
import { AktivitetsId } from '../../../../datatypes/brandedTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { AlleAktivitetTyper } from '../../../../utils/textMappers';

const splittPåEndretAvOgEndringsbeskrivelse = (beskrivelse: string) => {
    const førsteOrd = beskrivelse.split(' ')[0];
    return [førsteOrd, beskrivelse.replace(førsteOrd, '')];
};

const erReferatEndring = (endringsBeskrivelse: string, aktivitetsType: AlleAktivitetTyper) => {
    if (
        aktivitetsType == VeilarbAktivitetType.SAMTALEREFERAT_TYPE &&
        endringsBeskrivelse.includes('aktivitet opprettet')
    ) {
        return true;
    }
    return endringsBeskrivelse.includes('endret referat') || endringsBeskrivelse.includes('opprettet referat');
};

export const EndringsLinje = ({
    endring,
    aktivitetId,
    aktivitetsType,
}: {
    endring: Endring;
    aktivitetId: AktivitetsId;
    aktivitetsType: AlleAktivitetTyper;
}) => {
    const erBruker = !useErVeileder();
    const { aktivitetsVersjonRoute } = useRoutes();

    const beskrivelse = erBruker ? endring.beskrivelseForBruker : endring.beskrivelseForVeileder;
    const [endretAv, endringsbeskrivelse] = splittPåEndretAvOgEndringsbeskrivelse(beskrivelse);
    const endringsTypeErReferatEndring = erReferatEndring(endringsbeskrivelse, aktivitetsType);

    return (
        <div className="pb-4">
            <b>{endretAv}</b> {endringsbeskrivelse}
            <BodyShort>{formaterDatoEllerTidSiden(endring.tidspunkt)}</BodyShort>
            {endringsTypeErReferatEndring ? (
                <Link to={aktivitetsVersjonRoute(aktivitetId, endring.forrigeVersjonsId)}>
                    <AkselLink>Se tidligere versjon</AkselLink>
                </Link>
            ) : null}
        </div>
    );
};
