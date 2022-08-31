import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { AVBRUTT_AV_SYSTEM, STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { AktivitetStatus, Livslopsstatus } from '../../../../datatypes/aktivitetTypes';
import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import { formaterDatoManed } from '../../../../utils';
import styles from './DeleCVAvbruttVisning.module.css';
import { overskrift } from './tekster';

const getTitteltekst = (status: AktivitetStatus, livslopsstatus: Livslopsstatus, erHistorisk: boolean): string => {
    if (status === STATUS_AVBRUTT && livslopsstatus === AVBRUTT_AV_SYSTEM) {
        return `Fristen har gått ut`;
    }

    if (status === STATUS_AVBRUTT) {
        return `Aktiviteten er avbrutt`;
    }

    if (status === STATUS_FULLFOERT) {
        return `Aktiviteten er fullført`;
    }

    if (erHistorisk) {
        return '';
    }

    return 'Noe er feil, kontakt brukerstøtte';
};

const getTekst = (
    status: AktivitetStatus,
    livslopsstatus: Livslopsstatus,
    erHistorisk: boolean,
    svarfrist: string
): string => {
    if (status === STATUS_AVBRUTT && livslopsstatus === AVBRUTT_AV_SYSTEM) {
        return `Du kan ikke svare på spørsmålet fordi svarfristen gikk ut ${formaterDatoManed(svarfrist)}`;
    }

    if (status === STATUS_AVBRUTT) {
        return `Du kan ikke svare på spørsmålet fordi aktiviteten er avbrutt`;
    }

    if (status === STATUS_FULLFOERT) {
        return `Du kan ikke svare på spørsmålet fordi aktiviteten er fullført`;
    }

    if (erHistorisk) {
        return 'Du kan ikke svare på spørsmålet fordi oppfølgingsperioden er avsluttet';
    }

    return 'Noe er feil, kontakt brukerstøtte';
};

interface Props {
    status: AktivitetStatus;
    livslopsstatus: Livslopsstatus;
    erHistorisk: boolean;
    svarfrist: string;
}

export const DeleCVAvbruttVisning = (props: Props) => {
    const { status, livslopsstatus, erHistorisk, svarfrist } = props;

    const tekst = getTekst(status, livslopsstatus, erHistorisk, svarfrist);
    const titteltekst = getTitteltekst(status, livslopsstatus, erHistorisk);

    const Tittel = () => <Normaltekst className={styles.deleCVEndreTittel}>{overskrift}</Normaltekst>;
    const TittelMedUtloptTekst = () => (
        <>
            <Tittel />
            <Element className={styles.deleCVTittelUtloptTekst}>{titteltekst}</Element>
        </>
    );

    return (
        <EkspanderbarLinje
            tittel={<TittelMedUtloptTekst />}
            aapneTittel={<Tittel />}
            kanToogle
            aapneTekst="Åpne"
            lukkeTekst="Lukk"
        >
            <AlertStripeInfo className={styles.infoStripe}>{tekst}</AlertStripeInfo>
        </EkspanderbarLinje>
    );
};
