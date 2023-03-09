import 'moment-duration-format';

import {
    addMinutes,
    differenceInMinutes,
    format,
    isDate,
    minutesToHours,
    setHours,
    setMinutes,
    startOfDay,
} from 'date-fns';
import { da } from 'date-fns/locale';
import moment from 'moment';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE, STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../constant';
import {
    AktivitetStatus,
    AktivitetType,
    AlleAktiviteter,
    Lest,
    isArenaAktivitet,
} from '../../datatypes/aktivitetTypes';
import {
    MoteAktivitet,
    SamtalereferatAktivitet,
    StillingFraNavAktivitet,
    VeilarbAktivitet,
    VeilarbAktivitetType,
} from '../../datatypes/internAktivitetTypes';
import { Me } from '../../datatypes/oppfolgingTypes';

interface MoteTid {
    dato: Date;
    klokkeslett: string;
    varighet: number;
}

interface Data {
    dato?: string | Date;
    klokkeslett?: string;
    varighet?: string;
}

interface FraTil {
    fraDato?: string;
    tilDato?: string;
}

interface NoeSomKanHaEnEndretdato {
    endretDato?: string;
}

interface GamleNyeAktiviteter {
    nyereAktiviteter: AlleAktiviteter[];
    eldreAktiviteter: AlleAktiviteter[];
}

function compareUndefindedOrNull(a: any, b: any): number {
    if (a != null && b == null) {
        return -1;
    }
    if (a == null && b != null) {
        return 1;
    }

    return 0;
}

function sammenlignDato(a?: string, b?: string): number {
    if (!a || !b) {
        return compareUndefindedOrNull(a, b);
    }

    return b.localeCompare(a);
}

export function compareAktivitet(a: AlleAktiviteter, b: AlleAktiviteter): number {
    const aDato = isArenaAktivitet(a) ? a.fraDato : a.endretDato;
    const bDato = isArenaAktivitet(b) ? b.fraDato : b.endretDato;
    return sammenlignDato(aDato, bDato);
}

export function delCvikkeSvartSkalVises(aktivitet: StillingFraNavAktivitet): boolean {
    const erStillingFraNav = aktivitet.type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE;
    const harIkkeSvart = !aktivitet.stillingFraNavData?.cvKanDelesData;
    const status = aktivitet.status;
    const historisk = aktivitet.historisk;
    const ikkeAktiv = status === STATUS_AVBRUTT || status === STATUS_FULLFOERT || !!historisk;

    return erStillingFraNav && harIkkeSvart && !ikkeAktiv;
}

export function erNyEndringIAktivitet(aktivitet: VeilarbAktivitet, lestInformasjon: Lest, me: Me): boolean {
    const sisteEndringVarFraMeg =
        (aktivitet.endretAvType === 'BRUKER' && me.erBruker) ||
        (aktivitet.endretAvType === 'NAV' && me.erVeileder && aktivitet.endretAv === me.id);

    if (sisteEndringVarFraMeg) {
        return false;
    }

    if (!lestInformasjon) {
        return true;
    }

    const endretDatoAktivietetMoment = moment(aktivitet.endretDato || aktivitet.opprettetDato);

    if (endretDatoAktivietetMoment && moment(lestInformasjon.tidspunkt)) {
        // arenaAktiviteter kan ha opprettetDato som ligger fram i tiden, derfor må
        // vi ha en sjekk att opprettet dato ikke ligger fram i tiden
        return (
            endretDatoAktivietetMoment.isAfter(lestInformasjon.tidspunkt) &&
            endretDatoAktivietetMoment.isBefore(moment().add(5, 'minutes'))
        );
    }
    return false;
}

export function beregnKlokkeslettVarighet(aktivitet: MoteAktivitet): MoteTid | undefined {
    const { fraDato, tilDato } = aktivitet;
    if (fraDato && tilDato) {
        const fra = new Date(fraDato);
        const til = new Date(tilDato);
        const varighet = differenceInMinutes(til, fra);
        const klokkeslett = format(fra, 'HH:mm');
        return {
            dato: startOfDay(fra),
            klokkeslett,
            varighet,
        };
    }
    return undefined;
}

const toDate = (date: Date | string): Date => {
    if (isDate(date)) return date as Date;
    return new Date(date);
};

interface Klokkeslett {
    hour: number;
    minute: number;
}
const validKlokkeslett = (val: string): boolean => {
    const hourMinute = val.split(':');
    if (hourMinute.length != 2) return false;
    const [hour, minute] = hourMinute;
    return !isNaN(parseInt(hour)) && !isNaN(parseInt(minute));
};
const tilKlokkeslett = (klokkeslett: string): Klokkeslett => {
    const [hour, minute] = klokkeslett.split(':').map((it) => parseInt(it));
    return {
        hour,
        minute,
    };
};

export function beregnFraTil(data: Data): FraTil {
    const { dato, klokkeslett, varighet } = data;

    if (dato && klokkeslett && validKlokkeslett(klokkeslett) && varighet) {
        const { hour, minute } = tilKlokkeslett(klokkeslett);
        const fraDato = setMinutes(setHours(startOfDay(toDate(dato)), hour), minute);
        const { hour: varighetHours, minute: varighetMinutes } = tilKlokkeslett(varighet);
        const tilDato = addMinutes(toDate(fraDato), varighetHours * 60 + varighetMinutes);
        return {
            fraDato: fraDato.toISOString(),
            tilDato: tilDato.toISOString(),
        };
    }
    return {};
}

export function formatterVarighet(varighet?: string | number): string | undefined {
    if (!varighet) {
        return undefined;
    }
    if (typeof varighet === 'number' || !isNaN(parseInt(varighet))) {
        const varighetMinutter = parseInt(varighet as string); // parseInt can handle numbers
        const hours = minutesToHours(varighetMinutter); // Uses floor rounding
        const inputMinutes = typeof varighet === 'number' ? varighet : parseInt(varighet);
        const minutes = inputMinutes - 60 * hours;
        return `${prefixMed0(hours.toString())}:${prefixMed0(minutes.toString())}`;
    } else {
        // Assuming this is correctly formatted "HH:ss"
        return varighet;
    }
}

// TODO: Finn en bedre løsning i MoteAktivitet-form
const prefixMed0 = (val: string) => (val.length === 1 ? '0' + val : val);
export function formatterKlokkeslett(klokkeslett?: string): string | undefined {
    if (!klokkeslett || !validKlokkeslett(klokkeslett)) return undefined;
    const { hour, minute } = tilKlokkeslett(klokkeslett);
    return `${prefixMed0(hour.toString())}:${prefixMed0(minute.toString())}`;
}

export function formatterTelefonnummer(telefonnummer: string): string {
    let utenSpace = telefonnummer.replace(/ /g, '');

    if (utenSpace.length !== 8) {
        return telefonnummer;
    } else if (utenSpace.startsWith('8')) {
        return `${utenSpace.substring(0, 3)} ${utenSpace.substring(3, 5)} ${utenSpace.substring(5)}`;
    } else {
        const numberPairs = utenSpace.match(/.{1,2}/g);
        return numberPairs ? numberPairs.join(' ') : telefonnummer;
    }
}

function moteManglerPubliseringAvSamtalereferat(type: AktivitetType, erReferatPublisert?: boolean): boolean {
    return type === VeilarbAktivitetType.MOTE_TYPE && !erReferatPublisert;
}

function samtalreferatManglerPublisering(type: AktivitetType, erReferatPublisert?: boolean) {
    return type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE && !erReferatPublisert;
}

export function manglerPubliseringAvSamtaleReferat(
    aktivitet: MoteAktivitet | SamtalereferatAktivitet,
    status: AktivitetStatus
) {
    const { type, erReferatPublisert } = aktivitet;
    return (
        !type ||
        (moteManglerPubliseringAvSamtalereferat(type, erReferatPublisert) && status !== STATUS_AVBRUTT) ||
        samtalreferatManglerPublisering(type, erReferatPublisert)
    );
}

function erMoteOgAvbrutt(status: AktivitetStatus, aktivitetType: AktivitetType): boolean {
    return status === STATUS_AVBRUTT && aktivitetType === MOTE_TYPE;
}

function erAvtaltOgAvbrutt(erAvtalt: boolean, status: AktivitetStatus): boolean {
    return erAvtalt && status === STATUS_AVBRUTT;
}

function erFullfoertUtenReferat(erAvtalt: boolean, status: AktivitetStatus, aktivitetType: AktivitetType) {
    return (
        erAvtalt && status === STATUS_FULLFOERT && aktivitetType !== SAMTALEREFERAT_TYPE && aktivitetType !== MOTE_TYPE
    );
}

export function trengerBegrunnelse(erAvtalt: boolean, status: AktivitetStatus, aktivitetType: AktivitetType) {
    return (
        erAvtaltOgAvbrutt(erAvtalt, status) ||
        erFullfoertUtenReferat(erAvtalt, status, aktivitetType) ||
        erMoteOgAvbrutt(status, aktivitetType)
    );
}

export function sorterAktiviteter(
    aktiviteter: (AlleAktiviteter & { nesteStatus?: string })[],
    status: AktivitetStatus
): AlleAktiviteter[] {
    return aktiviteter
        .filter((a) => {
            // TODO: Look into this
            if (a.nesteStatus) {
                return a.nesteStatus === status;
            }
            return a.status === status;
        })
        .sort(compareAktivitet);
}

export function endretNyereEnnEnManedSiden(aktivitet: NoeSomKanHaEnEndretdato & FraTil): boolean {
    const sorteringsDatoString = [aktivitet.endretDato, aktivitet.tilDato, aktivitet.fraDato]
        .filter((possibleDate) => possibleDate !== undefined && possibleDate !== null)
        .find((possibleDate) => moment(possibleDate).isValid());

    const sorteringsDato = sorteringsDatoString ? moment(sorteringsDatoString) : undefined;

    return (
        sorteringsDato === undefined ||
        (sorteringsDato.isValid() && sorteringsDato.isAfter(moment().subtract(1, 'month').startOf('day'), 'd'))
    );
}

export const splitIEldreOgNyereAktiviteter = (aktiviteter: AlleAktiviteter[]): GamleNyeAktiviteter =>
    aktiviteter.reduce<GamleNyeAktiviteter>(
        (forrige, aktivitet) =>
            endretNyereEnnEnManedSiden(aktivitet)
                ? { ...forrige, nyereAktiviteter: [...forrige.nyereAktiviteter, aktivitet] }
                : { ...forrige, eldreAktiviteter: [...forrige.eldreAktiviteter, aktivitet] },
        { nyereAktiviteter: [], eldreAktiviteter: [] }
    );
