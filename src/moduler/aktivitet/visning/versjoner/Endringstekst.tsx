import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { useSelector } from 'react-redux';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import {
    FellesTransaksjonsTyper,
    MoteTransaksjonsType,
    SamtaleReferatTransaksjonsType,
    StillingFraNavTransaksjonsType,
    StillingTransaksjonsType,
} from '../../../../datatypes/transaksjonstyperTypes';
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
    aktivitet: VeilarbAktivitet;
    forrigeAktivitet?: VeilarbAktivitet;
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
        case MoteTransaksjonsType.MOTE_TID_OG_STED_ENDRET:
            return <>{brukeravhengigTekst} endret tid eller sted for møtet</>;
        case MoteTransaksjonsType.REFERAT_OPPRETTET:
        case SamtaleReferatTransaksjonsType.REFERAT_OPPRETTET:
            return <>{brukeravhengigTekst} opprettet referat</>;
        case MoteTransaksjonsType.REFERAT_ENDRET:
        case SamtaleReferatTransaksjonsType.REFERAT_ENDRET:
            return <>{brukeravhengigTekst} endret referatet</>;
        case MoteTransaksjonsType.REFERAT_PUBLISERT:
        case SamtaleReferatTransaksjonsType.REFERAT_PUBLISERT:
            return <>{brukeravhengigTekst} delte referatet</>;
        case FellesTransaksjonsTyper.BLE_HISTORISK:
            return <>Aktiviteten ble automatisk arkivert</>;
        case FellesTransaksjonsTyper.DETALJER_ENDRET:
            return <>{brukeravhengigTekst} endret detaljer på aktiviteten</>;
        case FellesTransaksjonsTyper.AVTALT:
            return <>{brukeravhengigTekst} merket aktiviteten som "Avtalt med NAV"</>;
        case FellesTransaksjonsTyper.OPPRETTET:
            return <>{brukeravhengigTekst} opprettet aktiviteten</>;
        case FellesTransaksjonsTyper.FORHAANDSORIENTERING_LEST: {
            const sittEllerDitt = erBruker ? 'ditt' : 'sitt';
            return (
                <>
                    {brukeravhengigTekst} bekreftet å ha lest informasjon om ansvaret {sittEllerDitt}
                </>
            );
        }
        case FellesTransaksjonsTyper.AVTALT_DATO_ENDRET: {
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
        case FellesTransaksjonsTyper.STATUS_ENDRET: {
            const fraStatus = forrigeAktivitet ? aktivitetStatusMap[forrigeAktivitet?.status] : 'ingen';
            const tilStatus = aktivitetStatusMap[aktivitet?.status];
            return (
                <>
                    {brukeravhengigTekst} flyttet aktiviteten fra {fraStatus} til {tilStatus}
                </>
            );
        }

        case StillingTransaksjonsType.ETIKETT_ENDRET: {
            const tilStatus = aktivitet.etikett ? stillingsEtikettMapper[aktivitet.etikett] : 'Ingen';
            return (
                <>
                    {brukeravhengigTekst} endret tilstand til {tilStatus}
                </>
            );
        }
        case StillingFraNavTransaksjonsType.DEL_CV_SVART: {
            const svar = aktivitet.stillingFraNavData.cvKanDelesData?.kanDeles ? 'Ja' : 'Nei';
            return (
                <>
                    {brukeravhengigTekst} svarte "{svar}" på spørsmålet "Er du interessert i denne stillingen?"
                </>
            );
        }
        case StillingFraNavTransaksjonsType.SOKNADSSTATUS_ENDRET: {
            const tilStatus = aktivitet.stillingFraNavData?.soknadsstatus
                ? stillingFraNavSoknadsstatusMapper[aktivitet.stillingFraNavData.soknadsstatus]
                : 'Ingen';
            return (
                <>
                    {brukeravhengigTekst} endret tilstand til {tilStatus}
                </>
            );
        }
        case StillingFraNavTransaksjonsType.IKKE_FATT_JOBBEN: {
            // Denne transaksjonen endrer også på aktivitetsstatus, som settes til fullført
            const tilStatus = aktivitet.stillingFraNavData?.soknadsstatus
                ? stillingFraNavSoknadsstatusMapper[aktivitet.stillingFraNavData.soknadsstatus]
                : 'Ingen';
            return (
                <>
                    {brukeravhengigTekst} avsluttet aktiviteten fordi kandidaten har {tilStatus}
                </>
            );
        }
        default:
            return <>{brukeravhengigTekst} gjorde noe</>;
    }
};

export default Endringstekst;
