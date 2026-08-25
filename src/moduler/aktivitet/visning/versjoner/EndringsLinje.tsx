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

const erReferatEndringEllerFørsteVersjonISamtaleReferat = (
    endringsBeskrivelse: string,
    aktivitetsType: AlleAktivitetTyper | VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE,
    erFørsteEndring: boolean,
    erSisteEndring: boolean,
) => {
    if (erSisteEndring) return false;
    const erReferatAktivitet =
        aktivitetsType === VeilarbAktivitetType.SAMTALEREFERAT_TYPE ||
        aktivitetsType === VeilarbAktivitetType.MOTE_TYPE;
    if (aktivitetsType == VeilarbAktivitetType.SAMTALEREFERAT_TYPE && erFørsteEndring) {
        return true;
    }
    if (!erReferatAktivitet) return false;
    return endringsBeskrivelse.includes('endret referat') || endringsBeskrivelse.includes('opprettet referat');
};

export const EndringsLinje = ({
    endring,
    aktivitetId,
    aktivitetsType,
}: {
    endring: Endring & { erFørsteEndring: boolean; erSisteEndring: boolean };
    aktivitetId: AktivitetsId;
    aktivitetsType: AlleAktivitetTyper | VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE;
}) => {
    const erBruker = !useErVeileder();
    const { aktivitetsVersjonRoute } = useRoutes();

    const beskrivelse = erBruker ? endring.beskrivelseForBruker : endring.beskrivelseForVeileder;
    const [endretAv, endringsbeskrivelse] = splittPåEndretAvOgEndringsbeskrivelse(beskrivelse);
    const skalViseLenkeTilTidligereVersjon = erReferatEndringEllerFørsteVersjonISamtaleReferat(
        endringsbeskrivelse,
        aktivitetsType,
        endring.erFørsteEndring,
        endring.erSisteEndring,
    );

    return (
        <div className="pb-4">
            <b>{endretAv}</b> {endringsbeskrivelse}
            <BodyShort>{formaterDatoEllerTidSiden(endring.tidspunkt)}</BodyShort>
            {skalViseLenkeTilTidligereVersjon ? (
                <Link to={aktivitetsVersjonRoute(aktivitetId, endring.versjonsId)}>
                    <AkselLink as={'div'}>Se tidligere versjon</AkselLink>
                </Link>
            ) : null}
        </div>
    );
};
