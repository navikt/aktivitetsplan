import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { useSelector } from 'react-redux';

import { Aktivitet, TransaksjonsType } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoKortManed } from '../../../../utils';
import {
    aktivitetStatusMap,
    stillingFraNavSoknadsstatusMapper,
    stillingsEtikettMapper,
} from '../../../../utils/textMappers';
import { selectErBruker } from '../../../identitet/identitet-selector';
import { hentBrukeravhengigTekst } from './brukeravhengigTekst';
import styles from './Endringstekst.module.less';

interface Props {
    aktivitet: Aktivitet;
    forrigeAktivitet?: Aktivitet;
}

const Endringstekst = (props: Props) => {
    const { aktivitet, forrigeAktivitet } = props;
    const erBruker = useSelector(selectErBruker);

    const brukeravhengigTekst = (
        <Element className={styles.identitet}>
            {hentBrukeravhengigTekst(erBruker, aktivitet.lagtInnAv, aktivitet.endretAv)}
        </Element>
    );

    switch (aktivitet.transaksjonsType) {
        case TransaksjonsType.MOTE_TID_OG_STED_ENDRET:
            return <>{brukeravhengigTekst} endret tid eller sted for møtet</>;
        case TransaksjonsType.REFERAT_OPPRETTET:
            return <>{brukeravhengigTekst} opprettet referat</>;
        case TransaksjonsType.REFERAT_ENDRET:
            return <>{brukeravhengigTekst} endret referatet</>;
        case TransaksjonsType.REFERAT_PUBLISERT:
            return <>{brukeravhengigTekst} delte referatet</>;
        case TransaksjonsType.BLE_HISTORISK:
            return <>Aktiviteten ble automatisk arkivert</>;
        case TransaksjonsType.DETALJER_ENDRET:
            return <>{brukeravhengigTekst} endret detaljer på aktiviteten</>;
        case TransaksjonsType.AVTALT:
            return <>{brukeravhengigTekst} merket aktiviteten som "Avtalt med NAV"</>;
        case TransaksjonsType.OPPRETTET:
            return <>{brukeravhengigTekst} opprettet aktiviteten</>;
        case TransaksjonsType.FORHAANDSORIENTERING_LEST: {
            const sittEllerDitt = erBruker ? 'ditt' : 'sitt';
            return (
                <>
                    {brukeravhengigTekst} bekreftet å ha lest informasjon om ansvaret {sittEllerDitt}
                </>
            );
        }
        case TransaksjonsType.AVTALT_DATO_ENDRET: {
            const fraDatoString = formaterDatoKortManed(
                forrigeAktivitet?.tilDato ? forrigeAktivitet.tilDato : 'ingen dato'
            );
            const tilDatoString = formaterDatoKortManed(aktivitet.tilDato);
            return (
                <>
                    {brukeravhengigTekst} endret til dato på aktiviteten fra {fraDatoString} til {tilDatoString}
                </>
            );
        }
        case TransaksjonsType.STATUS_ENDRET: {
            const fraStatus = forrigeAktivitet ? aktivitetStatusMap[forrigeAktivitet?.status] : 'ingen';
            const tilStatus = aktivitetStatusMap[aktivitet?.status];
            return (
                <>
                    {brukeravhengigTekst} flyttet aktiviteten fra {fraStatus} til {tilStatus}
                </>
            );
        }

        case TransaksjonsType.ETIKETT_ENDRET: {
            const tilStatus = aktivitet.etikett ? stillingsEtikettMapper[aktivitet.etikett] : 'Ingen';
            return (
                <>
                    {brukeravhengigTekst} endret tilstand til {tilStatus}
                </>
            );
        }
        case TransaksjonsType.DEL_CV_SVART: {
            const svar = aktivitet.stillingFraNavData?.cvKanDelesData.kanDeles ? 'Ja' : 'Nei';
            return (
                <>
                    {brukeravhengigTekst} svarte "{svar}" på spørsmålet "Er du interessert i denne stillingen?"
                </>
            );
        }
        case TransaksjonsType.SOKNADSSTATUS_ENDRET: {
            const tilStatus = aktivitet.stillingFraNavData?.soknadsstatus
                ? stillingFraNavSoknadsstatusMapper[aktivitet.stillingFraNavData.soknadsstatus]
                : 'Ingen';
            return (
                <>
                    {brukeravhengigTekst} endret tilstand til {tilStatus}
                </>
            );
        }
        default:
            return <>{brukeravhengigTekst} gjorde noe</>;
    }
};

export default Endringstekst;
