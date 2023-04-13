import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { DeleCVAvbruttVisning } from './DeleCVAvbruttVisning';
import { DeleCvSvarVisning } from './DeleCvSvarVisning';
import { MeldInteresseForStilling } from './MeldInteresseForStilling';

interface PropTypes {
    aktivitet: StillingFraNavAktivitet;
}

export const Ingress = ({ className }: { className?: string }) => (
    <BodyShort className={className}>Du bestemmer selv om NAV kan dele CV-en din for denne stillingen.</BodyShort>
);

export const DeleCvContainer = ({ aktivitet }: PropTypes) => {
    const stillingFraNavData = aktivitet.stillingFraNavData;
    const cvKanDelesSvar = stillingFraNavData && stillingFraNavData?.cvKanDelesData;
    const erHistorisk = aktivitet.historisk;

    if (cvKanDelesSvar) {
        return <DeleCvSvarVisning cvKanDelesData={cvKanDelesSvar} />;
    }

    if (erHistorisk || aktivitet.status === AktivitetStatus.FULLFOERT || aktivitet.status === AktivitetStatus.AVBRUTT) {
        return (
            <DeleCVAvbruttVisning
                status={aktivitet.status}
                livslopsstatus={stillingFraNavData.livslopsstatus}
                erHistorisk={erHistorisk}
                svarfrist={stillingFraNavData.svarfrist}
            />
        );
    }

    return <MeldInteresseForStilling aktivitet={aktivitet} />;
};
