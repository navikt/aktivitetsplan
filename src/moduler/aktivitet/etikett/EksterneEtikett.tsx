import classNames from 'classnames';
import React from 'react';

import { EksternAktivitet, EksternAktivitetType } from '../../../datatypes/internAktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import styles from './etikett.module.less';

type EksternEtikett = readonly [string, string] | undefined;

const arenaTiltakEtikettKodeMapper = (kode: string): EksternEtikett => {
    switch (kode) {
        case 'SOKT_INN':
            return ['Søkt inn på tiltaket', styles.navLysBlaLighten60] as const;
        case 'AVSLAG':
            return ['Fått avslag', styles.navLysBlaLighten60] as const;
        case 'IKKE_AKTUELL':
            return ['Ikke aktuell for tiltaket', styles.gray200] as const;
        case 'IKKE_MOETT':
            return ['Ikke møtt på tiltaket', styles.navOransjeLighten60] as const;
        case 'INFOMOETE':
            return ['Infomøte før tiltaket', styles.navLysBlaLighten60] as const;
        case 'TAKKET_JA':
            return ['Takket ja til tilbud', styles.navLysBlaLighten60] as const;
        case 'TAKKET_NEI':
            return ['Takket nei til tilbud', styles.navOransjeLighten60] as const;
        case 'FATT_PLASS':
            return ['Fått plass på tiltaket', styles.navLysBlaLighten60] as const;
        case 'VENTELISTE':
            return ['På venteliste', styles.navLysBlaLighten60] as const;
        default:
            return undefined;
    }
};

const getEtikettByKode = (type: EksternAktivitetType, kode: string): EksternEtikett => {
    switch (type) {
        case EksternAktivitetType.ARENA_TILTAK_TYPE:
            return arenaTiltakEtikettKodeMapper(kode);
        case EksternAktivitetType.MIDL_LONNSTILSKUDD_TYPE:
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
                        <EtikettBase className={classNames(eksternEtikett[1], className)} key={i}>
                            {eksternEtikett[0]}
                        </EtikettBase>
                    ) : null;
                })}
        </>
    );
};

export default EksterneEtiketter;
