import classNames from 'classnames';
import React from 'react';

import { EksternAktivitet, EksternAktivitetType } from '../../../datatypes/internAktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import styles from './etikett.module.less';

interface EksternEtikett {
    tekst: string;
    style: string;
}

const arenaTiltakEtikettKodeMapper = (kode: string): EksternEtikett | undefined => {
    switch (kode) {
        case 'SOKT_INN':
            return { tekst: 'Søkt inn på tiltaket', style: styles.navLysBlaLighten60 };
        case 'AVSLAG':
            return { tekst: 'Fått avslag', style: styles.navLysBlaLighten60 };
        case 'IKKE_AKTUELL':
            return { tekst: 'Ikke aktuell for tiltaket', style: styles.gray200 };
        case 'IKKE_MOETT':
            return { tekst: 'Ikke møtt på tiltaket', style: styles.navOransjeLighten60 };
        case 'INFOMOETE':
            return { tekst: 'Infomøte før tiltaket', style: styles.navLysBlaLighten60 };
        case 'TAKKET_JA':
            return { tekst: 'Takket ja til tilbud', style: styles.navLysBlaLighten60 };
        case 'TAKKET_NEI':
            return { tekst: 'Takket nei til tilbud', style: styles.navOransjeLighten60 };
        case 'FATT_PLASS':
            return { tekst: 'Fått plass på tiltaket', style: styles.navLysBlaLighten60 };
        case 'VENTELISTE':
            return { tekst: 'På venteliste', style: styles.navLysBlaLighten60 };
        default:
            return undefined;
    }
};

const getEtikettByKode = (type: EksternAktivitetType, kode: string): EksternEtikett | undefined => {
    switch (type) {
        case EksternAktivitetType.ARENA_TILTAK_TYPE:
            return arenaTiltakEtikettKodeMapper(kode);
        default:
            return undefined;
    }
};

export interface Props {
    aktivitet: EksternAktivitet;
    className?: string;
}

const EksterneEtiketter = (props: Props) => {
    const { aktivitet, className } = props;
    const { etiketter, type } = aktivitet.eksternAktivitet;

    if (!etiketter) return null;

    return (
        <>
            {etiketter
                .map((etikett) => getEtikettByKode(type, etikett.kode))
                .map((eksternEtikett, i) => {
                    return !!eksternEtikett ? (
                        <EtikettBase className={classNames(eksternEtikett.style, className)} key={i}>
                            {eksternEtikett.tekst}
                        </EtikettBase>
                    ) : null;
                })}
        </>
    );
};

export default EksterneEtiketter;
