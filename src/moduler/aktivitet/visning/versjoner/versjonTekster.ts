import { Aktivitet, AktivitetStatus, StillingsStatus, TransaksjonsType } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoKortManed } from '../../../../utils';

const aktivitetStatusTilBeskrivelse = (aktivitetStatus: AktivitetStatus ) => {
    switch (aktivitetStatus) {
        case 'AVBRUTT':
            return 'avbrutt';
        case 'FULLFORT':
            return 'fullført';
        case 'GJENNOMFORES':
            return 'gjennomfører';
        case 'PLANLAGT':
            return 'planlegger';
        case 'BRUKER_ER_INTERESSERT':
            return 'forslag';
    }
}

const stillingStatusTilBeskrivelse = (stillingStatus: StillingsStatus) => {
    switch (stillingStatus) {
        case 'INGEN_VALGT':
            return 'Ingen';
        case 'SOKNAD_SENDT':
            return 'Søknaden er sendt';
        case 'INNKALT_TIL_INTERVJU':
            return 'Skal på intervju';
        case 'AVSLAG':
            return 'Fått avslag';
        case 'JOBBTILBUD':
            return 'Fått jobbtilbud';

    }
}

export const endringsTekst = (aktivitet: Aktivitet, forrigeAktivitet?: Aktivitet) => {
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
        case TransaksjonsType.AVTALT_DATO_ENDRET: {
            const fraDatoString = formaterDatoKortManed(forrigeAktivitet ? forrigeAktivitet.tilDato : undefined);
            const tilDatoString = formaterDatoKortManed(aktivitet.tilDato);
            return `endret til dato på aktiviteten fra ${fraDatoString} til ${tilDatoString}`;
        }
        case TransaksjonsType.STATUS_ENDRET: {
            const fraStatus = forrigeAktivitet ? aktivitetStatusTilBeskrivelse(forrigeAktivitet?.status) : 'ingen';
            const tilStatus = aktivitetStatusTilBeskrivelse(aktivitet?.status);
            return `flyttet aktiviteten fra ${fraStatus} til ${tilStatus}`;
        }

        case TransaksjonsType.ETIKETT_ENDRET: {
            const tilStatus = aktivitet.etikett ? stillingStatusTilBeskrivelse(aktivitet.etikett) : 'Ingen';
            return `endret tilstand til ${tilStatus}`;
        }
        default:
            return 'Gjorde noe';
    }
}
