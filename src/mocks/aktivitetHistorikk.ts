import { format, parseISO } from 'date-fns';

import { AktivitetStatus, Kanal, StillingFraNavSoknadsstatus } from '../datatypes/aktivitetTypes';
import { AktivitetsVersjon } from '../datatypes/brandedTypes';
import { Historikk } from '../datatypes/Historikk';
import {
    MoteAktivitet,
    SokeavtaleAktivitet,
    StillingFraNavAktivitet,
    VeilarbAktivitet,
    VeilarbAktivitetType,
} from '../datatypes/internAktivitetTypes';
import {
    FellesTransaksjonsTyper,
    MoteTransaksjonsType,
    SamtaleReferatTransaksjonsType,
    StillingFraNavTransaksjonsType,
    StillingTransaksjonsType,
} from '../datatypes/transaksjonstyperTypes';
import { aktivitetStatusMap, kanalMap, stillingOgStillingFraNavEtikettMapper } from '../utils/textMappers';

type AktivitetendringsType =
    | 'BLE_HISTORISK'
    | 'OPPRETTET'
    | 'OPPRETTET_SOM_AVTALT'
    | 'KASSERT'
    | 'STATUS_ENDRET'
    | 'BLITT_AVTALT'
    | 'TIL_DATO_ENDRET'
    | 'FRA_DATO_ENDRET'
    | 'STILLINGSOK_ETIKETT_ENDRET'
    | 'MOTE_TIDSPUNKT_ENDRET'
    | 'MOTE_STED_ENDRET'
    | 'MOTE_KANAL_ENDRET'
    | 'MOTE_FORBEREDELSER_ENDRET'
    | 'REFERAT_OPPRETTET'
    | 'REFERAT_ENDRET'
    | 'REFERAT_PUBLISERT'
    | 'FORHAANDSORIENTERING_LEST'
    | 'DEL_CV_SVART'
    | 'SOKNADSSTATUS_ENDRET'
    | 'IKKE_FATT_JOBBEN'
    | 'FATT_JOBBEN'
    | 'TITTEL_ENDRET'
    | 'BESKRIVELSE_ENDRET'
    | 'DETALJER_ENDRET'
    | 'ANTALL_SOKNADER_I_AVTALE_ENDRET';

const formaterDato = (dato: string | undefined) => {
    if (!dato) return 'ikke satt';
    const parsed = parseISO(dato);
    if (Number.isNaN(parsed.getTime())) return dato;
    return format(parsed, 'dd.MM.yyyy');
};

const tilLabel = (value: string | undefined | null) => value ?? 'ikke satt';

const tilStatusLabel = (status: AktivitetStatus | undefined) => {
    if (!status) return 'ikke satt';
    return aktivitetStatusMap[status] ?? status;
};

const tilEtikettLabel = (etikett: string | undefined) => {
    if (!etikett) return 'ikke satt';
    return (
        stillingOgStillingFraNavEtikettMapper[etikett as keyof typeof stillingOgStillingFraNavEtikettMapper] ?? etikett
    );
};

const tilKanalLabel = (kanal: Kanal | undefined) => {
    if (!kanal) return 'ikke satt';
    return kanalMap[kanal] ?? kanal;
};

const erLik = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

const lagAktorTekst = (nyere: VeilarbAktivitet) => {
    const aktorForVeileder =
        nyere.endretAvType === 'BRUKER' ? 'Bruker' : nyere.endretAvType === 'NAV' ? 'Nav' : 'Systemet';
    const aktorForBruker = nyere.endretAvType === 'BRUKER' ? 'Du' : nyere.endretAvType === 'NAV' ? 'Nav' : 'Systemet';
    return { aktorForVeileder, aktorForBruker };
};

const erMote = (aktivitet: VeilarbAktivitet): aktivitet is MoteAktivitet =>
    aktivitet.type === VeilarbAktivitetType.MOTE_TYPE;

const erSokeavtale = (aktivitet: VeilarbAktivitet): aktivitet is SokeavtaleAktivitet =>
    aktivitet.type === VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE;

const erStillingFraNav = (aktivitet: VeilarbAktivitet): aktivitet is StillingFraNavAktivitet =>
    aktivitet.type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE;

const harReferat = (aktivitet: VeilarbAktivitet): aktivitet is VeilarbAktivitet & { referat: string } =>
    'referat' in aktivitet && typeof aktivitet.referat === 'string';

const bestemEndringsType = (nyere: VeilarbAktivitet, eldre: VeilarbAktivitet): AktivitetendringsType => {
    switch (nyere.transaksjonsType) {
        case FellesTransaksjonsTyper.BLE_HISTORISK:
            return 'BLE_HISTORISK';
        case FellesTransaksjonsTyper.KASSERT:
            return 'KASSERT';
        case FellesTransaksjonsTyper.FORHAANDSORIENTERING_LEST:
            return 'FORHAANDSORIENTERING_LEST';
        case FellesTransaksjonsTyper.STATUS_ENDRET:
            return 'STATUS_ENDRET';
        case FellesTransaksjonsTyper.AVTALT:
        case FellesTransaksjonsTyper.AVTALT_DATO_ENDRET:
            return 'BLITT_AVTALT';
        case StillingTransaksjonsType.ETIKETT_ENDRET:
            return 'STILLINGSOK_ETIKETT_ENDRET';
        case MoteTransaksjonsType.MOTE_TID_OG_STED_ENDRET:
            if (erMote(nyere) && erMote(eldre)) {
                if (!erLik(nyere.kanal, eldre.kanal)) return 'MOTE_KANAL_ENDRET';
                if (!erLik(nyere.forberedelser, eldre.forberedelser)) return 'MOTE_FORBEREDELSER_ENDRET';
                if (!erLik(nyere.adresse, eldre.adresse)) return 'MOTE_STED_ENDRET';
            }
            return 'MOTE_TIDSPUNKT_ENDRET';
        case MoteTransaksjonsType.REFERAT_PUBLISERT:
        case SamtaleReferatTransaksjonsType.REFERAT_PUBLISERT:
            return 'REFERAT_PUBLISERT';
        case MoteTransaksjonsType.REFERAT_OPPRETTET:
        case SamtaleReferatTransaksjonsType.REFERAT_OPPRETTET:
            return 'REFERAT_OPPRETTET';
        case MoteTransaksjonsType.REFERAT_ENDRET:
        case SamtaleReferatTransaksjonsType.REFERAT_ENDRET:
            if ((!harReferat(eldre) || !eldre.referat) && harReferat(nyere) && nyere.referat)
                return 'REFERAT_OPPRETTET';
            return 'REFERAT_ENDRET';
        case StillingFraNavTransaksjonsType.DEL_CV_SVART:
            return 'DEL_CV_SVART';
        case StillingFraNavTransaksjonsType.IKKE_FATT_JOBBEN:
            return 'IKKE_FATT_JOBBEN';
        case StillingFraNavTransaksjonsType.FATT_JOBBEN:
            return 'FATT_JOBBEN';
        case StillingFraNavTransaksjonsType.SOKNADSSTATUS_ENDRET:
            return 'SOKNADSSTATUS_ENDRET';
        case FellesTransaksjonsTyper.OPPRETTET:
            return nyere.avtalt ? 'OPPRETTET_SOM_AVTALT' : 'OPPRETTET';
        case FellesTransaksjonsTyper.DETALJER_ENDRET:
        default:
            break;
    }

    if (!erLik(nyere.tittel, eldre.tittel)) return 'TITTEL_ENDRET';
    if (!erLik(nyere.beskrivelse, eldre.beskrivelse)) return 'BESKRIVELSE_ENDRET';
    if (!erLik(nyere.tilDato, eldre.tilDato)) return 'TIL_DATO_ENDRET';
    if (!erLik(nyere.fraDato, eldre.fraDato)) return 'FRA_DATO_ENDRET';
    if (!erLik(nyere.etikett, eldre.etikett)) return 'STILLINGSOK_ETIKETT_ENDRET';
    if (!erLik(nyere.status, eldre.status)) return 'STATUS_ENDRET';
    if (!eldre.avtalt && nyere.avtalt) return 'BLITT_AVTALT';

    if (nyere.type === VeilarbAktivitetType.MOTE_TYPE || nyere.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE) {
        const eldreReferat = harReferat(eldre) ? eldre.referat : undefined;
        const nyereReferat = harReferat(nyere) ? nyere.referat : undefined;
        if (!eldreReferat && nyereReferat) return 'REFERAT_OPPRETTET';
        if (!erLik(eldreReferat, nyereReferat)) return 'REFERAT_ENDRET';
    }

    if (erMote(nyere) && erMote(eldre)) {
        if (!erLik(nyere.kanal, eldre.kanal)) return 'MOTE_KANAL_ENDRET';
        if (!erLik(nyere.adresse, eldre.adresse)) return 'MOTE_STED_ENDRET';
        if (!erLik(nyere.forberedelser, eldre.forberedelser)) return 'MOTE_FORBEREDELSER_ENDRET';
        if (
            !erLik(nyere.fraDato, eldre.fraDato) ||
            !erLik(nyere.tilDato, eldre.tilDato) ||
            !erLik(nyere.klokkeslett, eldre.klokkeslett) ||
            !erLik(nyere.varighet, eldre.varighet)
        ) {
            return 'MOTE_TIDSPUNKT_ENDRET';
        }
    }

    if (erStillingFraNav(nyere) && erStillingFraNav(eldre)) {
        if (!erLik(nyere.stillingFraNavData.soknadsstatus, eldre.stillingFraNavData.soknadsstatus)) {
            if (nyere.stillingFraNavData.soknadsstatus === StillingFraNavSoknadsstatus.FATT_JOBBEN)
                return 'FATT_JOBBEN';
            if (nyere.stillingFraNavData.soknadsstatus === StillingFraNavSoknadsstatus.IKKE_FATT_JOBBEN)
                return 'IKKE_FATT_JOBBEN';
            return 'SOKNADSSTATUS_ENDRET';
        }
        if (!erLik(nyere.stillingFraNavData.cvKanDelesData, eldre.stillingFraNavData.cvKanDelesData)) {
            return 'DEL_CV_SVART';
        }
        if (!erLik(nyere.stillingFraNavData.detaljer, eldre.stillingFraNavData.detaljer)) return 'DETALJER_ENDRET';
    }

    if (!erLik(nyere.forhaandsorientering?.lestDato, eldre.forhaandsorientering?.lestDato)) {
        return 'FORHAANDSORIENTERING_LEST';
    }

    if (erSokeavtale(nyere) && erSokeavtale(eldre)) {
        if (
            !erLik(nyere.antallStillingerSokes, eldre.antallStillingerSokes) ||
            !erLik(nyere.antallStillingerIUken, eldre.antallStillingerIUken)
        ) {
            return 'ANTALL_SOKNADER_I_AVTALE_ENDRET';
        }
    }

    return 'DETALJER_ENDRET';
};

const lagBeskrivelse = (endringstype: AktivitetendringsType, nyere: VeilarbAktivitet, eldre: VeilarbAktivitet) => {
    switch (endringstype) {
        case 'BLE_HISTORISK':
            return 'gjorde aktiviteten historisk';
        case 'OPPRETTET':
            return 'opprettet aktivitet';
        case 'OPPRETTET_SOM_AVTALT':
            return 'opprettet aktivitet og markerte den som "Avtalt med Nav"';
        case 'KASSERT':
            return 'kasserte aktiviteten';
        case 'STATUS_ENDRET':
            return `flyttet aktiviteten fra ${tilStatusLabel(eldre.status)} til ${tilStatusLabel(nyere.status)}`;
        case 'BLITT_AVTALT':
            return 'merket aktiviteten "Avtalt med Nav"';
        case 'TIL_DATO_ENDRET':
            return `endret til-dato fra ${formaterDato(eldre.tilDato)} til ${formaterDato(nyere.tilDato)}`;
        case 'FRA_DATO_ENDRET':
            return `endret fra-dato fra ${formaterDato(eldre.fraDato)} til ${formaterDato(nyere.fraDato)}`;
        case 'STILLINGSOK_ETIKETT_ENDRET':
            return `endret stillingsstatus fra "${tilEtikettLabel(eldre.etikett)}" til "${tilEtikettLabel(nyere.etikett)}"`;
        case 'MOTE_TIDSPUNKT_ENDRET':
            return `endret møtetidspunkt fra ${formaterDato(eldre.fraDato)} til ${formaterDato(nyere.fraDato)}`;
        case 'MOTE_STED_ENDRET':
            return `endret møtested fra "${tilLabel(erMote(eldre) ? eldre.adresse : undefined)}" til "${tilLabel(erMote(nyere) ? nyere.adresse : undefined)}"`;
        case 'MOTE_KANAL_ENDRET':
            return `endret møtekanal fra "${tilKanalLabel(erMote(eldre) ? eldre.kanal : undefined)}" til "${tilKanalLabel(erMote(nyere) ? nyere.kanal : undefined)}"`;
        case 'MOTE_FORBEREDELSER_ENDRET':
            return 'endret forberedelser til møtet';
        case 'REFERAT_OPPRETTET':
            return 'opprettet referat';
        case 'REFERAT_ENDRET':
            return 'endret referat';
        case 'REFERAT_PUBLISERT':
            return 'publiserte referat';
        case 'FORHAANDSORIENTERING_LEST':
            return 'markerte forhåndsorientering som lest';
        case 'DEL_CV_SVART': {
            if (erStillingFraNav(nyere)) {
                const nyVerdi = nyere.stillingFraNavData.cvKanDelesData?.kanDeles;
                return nyVerdi ? 'svarte ja på deling av CV' : 'svarte nei på deling av CV';
            }
            return 'svarte på deling av CV';
        }
        case 'SOKNADSSTATUS_ENDRET': {
            const gammel = erStillingFraNav(eldre) ? eldre.stillingFraNavData.soknadsstatus : undefined;
            const ny = erStillingFraNav(nyere) ? nyere.stillingFraNavData.soknadsstatus : undefined;
            return `endret søknadsstatus fra "${tilEtikettLabel(gammel)}" til "${tilEtikettLabel(ny)}"`;
        }
        case 'IKKE_FATT_JOBBEN':
            return 'markerte at bruker ikke fikk jobben';
        case 'FATT_JOBBEN':
            return 'markerte at bruker fikk jobben';
        case 'TITTEL_ENDRET':
            return `endret tittel fra "${tilLabel(eldre.tittel)}" til "${tilLabel(nyere.tittel)}"`;
        case 'BESKRIVELSE_ENDRET':
            return 'endret beskrivelse';
        case 'ANTALL_SOKNADER_I_AVTALE_ENDRET': {
            const gammel = erSokeavtale(eldre) ? eldre.antallStillingerSokes : undefined;
            const ny = erSokeavtale(nyere) ? nyere.antallStillingerSokes : undefined;
            return `endret antall søknader i avtale fra "${tilLabel(gammel?.toString())}" til "${tilLabel(ny?.toString())}"`;
        }
        case 'DETALJER_ENDRET':
        default:
            return 'endret detaljer på aktiviteten';
    }
};

const sorterVersjonerNyesteForst = (versjoner: VeilarbAktivitet[]) =>
    [...versjoner].sort((a, b) => Number.parseInt(b.versjon, 10) - Number.parseInt(a.versjon, 10));

export const byggHistorikkFraVersjoner = (aktivitetsVersjoner: VeilarbAktivitet[]): Historikk => {
    const sorterteVersjoner = sorterVersjonerNyesteForst(aktivitetsVersjoner);
    const endringer = sorterteVersjoner.slice(0, -1).map((nyereVersjon, index) => {
        const eldreVersjon = sorterteVersjoner[index + 1];
        const endringstype = bestemEndringsType(nyereVersjon, eldreVersjon);
        const endringsTekst = lagBeskrivelse(endringstype, nyereVersjon, eldreVersjon);
        const aktorTekst = lagAktorTekst(nyereVersjon);
        return {
            endretAvType: nyereVersjon.endretAvType,
            endretAv: nyereVersjon.endretAv,
            tidspunkt: nyereVersjon.endretDato,
            beskrivelseForVeileder: `${aktorTekst.aktorForVeileder} ${endringsTekst}`,
            beskrivelseForBruker: `${aktorTekst.aktorForBruker} ${endringsTekst}`,
            versjonsId: nyereVersjon.versjon,
        };
    });

    const eldsteVersjon = sorterteVersjoner[sorterteVersjoner.length - 1];
    if (eldsteVersjon) {
        const opprettetType: AktivitetendringsType = eldsteVersjon.avtalt ? 'OPPRETTET_SOM_AVTALT' : 'OPPRETTET';
        const opprettetTekst = lagBeskrivelse(opprettetType, eldsteVersjon, eldsteVersjon);
        const aktorTekst = lagAktorTekst(eldsteVersjon);
        endringer.push({
            endretAvType: eldsteVersjon.endretAvType,
            endretAv: eldsteVersjon.endretAv,
            tidspunkt: eldsteVersjon.opprettetDato || eldsteVersjon.endretDato,
            beskrivelseForVeileder: `${aktorTekst.aktorForVeileder} ${opprettetTekst}`,
            beskrivelseForBruker: `${aktorTekst.aktorForBruker} ${opprettetTekst}`,
            versjonsId: eldsteVersjon.versjon,
        });
    }

    return { endringer };
};
