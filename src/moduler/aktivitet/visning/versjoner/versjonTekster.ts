import { Aktivitet, TransaksjonsType } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoKortManed } from '../../../../utils';
import { aktivitetStatusMap, etikettMapper, stillingFraNavSoknadsstatusMapper } from '../../../../utils/textMappers';

export const endringsTekst = (erBruker: boolean, aktivitet: Aktivitet, forrigeAktivitet?: Aktivitet) => {
    switch (aktivitet.transaksjonsType) {
        case TransaksjonsType.MOTE_TID_OG_STED_ENDRET:
            return 'endret tid eller sted for møtet';
        case TransaksjonsType.REFERAT_OPPRETTET:
            return 'opprettet referat';
        case TransaksjonsType.REFERAT_ENDRET:
            return 'endret referatet';
        case TransaksjonsType.REFERAT_PUBLISERT:
            return 'delte referatet';
        case TransaksjonsType.BLE_HISTORISK:
            return 'arkiverte aktiviteten';
        case TransaksjonsType.DETALJER_ENDRET:
            return 'endret detaljer på aktiviteten';
        case TransaksjonsType.AVTALT:
            return 'merket aktiviteten som "Avtalt med NAV"';
        case TransaksjonsType.OPPRETTET:
            return 'opprettet aktiviteten';
        case TransaksjonsType.FORHAANDSORIENTERING_LEST: {
            const sittEllerDitt = erBruker ? 'ditt' : 'sitt';
            return `bekreftet å ha lest informasjon om ansvaret ${sittEllerDitt}`;
        }
        case TransaksjonsType.AVTALT_DATO_ENDRET: {
            const fraDatoString = formaterDatoKortManed(
                forrigeAktivitet?.tilDato ? forrigeAktivitet.tilDato : 'ingen dato'
            );
            const tilDatoString = formaterDatoKortManed(aktivitet.tilDato);
            return `endret til dato på aktiviteten fra ${fraDatoString} til ${tilDatoString}`;
        }
        case TransaksjonsType.STATUS_ENDRET: {
            const fraStatus = forrigeAktivitet ? aktivitetStatusMap[forrigeAktivitet?.status] : 'ingen';
            const tilStatus = aktivitetStatusMap[aktivitet?.status];
            return `flyttet aktiviteten fra ${fraStatus} til ${tilStatus}`;
        }

        case TransaksjonsType.ETIKETT_ENDRET: {
            const tilStatus = aktivitet.etikett ? etikettMapper[aktivitet.etikett] : 'Ingen';
            return `endret tilstand til ${tilStatus}`;
        }
        case TransaksjonsType.DEL_CV_SVART: {
            const svar = aktivitet.stillingFraNavData?.cvKanDelesData.kanDeles ? 'Ja' : 'Nei';
            return `svarte "${svar}" på spørsmålet "Er du interessert i denne stillingen?`;
        }
        case TransaksjonsType.SOKNADSSTATUS_ENDRET: {
            const tilStatus = aktivitet.stillingFraNavData?.soknadsstatus
                ? stillingFraNavSoknadsstatusMapper[aktivitet.stillingFraNavData.soknadsstatus]
                : 'Ingen';
            return `endret tilstand til ${tilStatus}`;
        }
        default:
            return 'Gjorde noe';
    }
};
