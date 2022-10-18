import 'moment-duration-format';

import moment, { DurationInputArg1 } from 'moment';

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
    dato?: string;
    klokkeslett?: string;
    varighet?: string;
}

interface Data {
    dato?: string;
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
        (aktivitet.lagtInnAv === 'BRUKER' && me.erBruker) ||
        (aktivitet.lagtInnAv === 'NAV' && me.erVeileder && aktivitet.endretAv === me.id);

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

export function beregnKlokkeslettVarighet(aktivitet: MoteAktivitet): MoteTid {
    const { fraDato } = aktivitet;
    const { tilDato } = aktivitet;
    if (fraDato && tilDato) {
        const fraMoment = moment(fraDato);
        const tilMoment = moment(tilDato);
        const klokkeslett = fraMoment.format('HH:mm');
        const diff = moment.duration(tilMoment.diff(fraMoment));
        const varighet = `${('0' + diff.hours()).slice(-2)}:${('0' + diff.minutes()).slice(-2)}`;
        return {
            dato: fraMoment.startOf('day').toISOString(),
            klokkeslett,
            varighet,
        };
    }
    return {};
}

export function beregnFraTil(data: Data): FraTil {
    const { dato, klokkeslett, varighet } = data;

    if (dato && klokkeslett && varighet) {
        const fraDato = moment(dato).startOf('day').add(moment.duration(klokkeslett)).toISOString();
        const tilDato = moment(fraDato).add(moment.duration(varighet)).toISOString();
        return {
            fraDato,
            tilDato,
        };
    }
    return {};
}

export function formatterVarighet(varighet: DurationInputArg1): string {
    return moment.duration(varighet, 'minutes').format('h:mm', { trim: false });
}

export function formatterKlokkeslett(klokkeslett: DurationInputArg1): string {
    return formatterVarighet(klokkeslett);
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

export function endretSenereEnnEnManedSiden(aktivitet: NoeSomKanHaEnEndretdato & FraTil): boolean {
    const sorteringsDato = [moment(aktivitet.endretDato), moment(aktivitet.tilDato), moment(aktivitet.fraDato)].find(
        (possibleDate) => possibleDate.isValid()
    );
    return (
        sorteringsDato !== undefined &&
        sorteringsDato!!.isValid() &&
        sorteringsDato.isAfter(moment().subtract(1, 'month').startOf('day'), 'd')
    );
}

export const splitIEldreOgNyereAktiviteter = (aktiviteter: AlleAktiviteter[]): GamleNyeAktiviteter =>
    aktiviteter.reduce<GamleNyeAktiviteter>(
        (forrige, aktivitet) =>
            endretSenereEnnEnManedSiden(aktivitet)
                ? { ...forrige, nyereAktiviteter: [...forrige.nyereAktiviteter, aktivitet] }
                : { ...forrige, eldreAktiviteter: [...forrige.eldreAktiviteter, aktivitet] },
        { nyereAktiviteter: [], eldreAktiviteter: [] }
    );
