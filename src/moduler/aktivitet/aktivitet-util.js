import 'moment-duration-format';
import { erMerEnnEnManederSiden, moment } from '../../utils';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE, STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../constant';

export function compareAktivitet(a, b) {
    if (b.avtalt && !a.avtalt) {
        return 1;
    }
    if (!b.avtalt && a.avtalt) {
        return -1;
    }
    if (a.fraDato !== null && b.fraDato === null) {
        return -1;
    }
    if (a.fraDato === null && b.fraDato !== null) {
        return 1;
    }
    if (a.fraDato === null && b.fraDato === null) {
        return 0;
    }

    return b.fraDato.localeCompare(a.fraDato);
}

export function erNyEndringIAktivitet(aktivitet, lestInformasjon, me) {
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

export function beregnKlokkeslettVarighet(aktivitet) {
    const { fraDato } = aktivitet;
    const { tilDato } = aktivitet;
    if (fraDato && tilDato) {
        const fraMoment = moment(fraDato);
        const tilMoment = moment(tilDato);
        const klokkeslett = fraMoment.minutes() + fraMoment.hours() * 60;
        const varighet = moment.duration(tilMoment.diff(fraMoment)).asMinutes();
        return {
            dato: fraMoment.startOf('day').toISOString(),
            klokkeslett,
            varighet
        };
    }
    return {};
}

export function beregnFraTil(data) {
    const { dato } = data;
    const { klokkeslett } = data;
    const { varighet } = data;
    if (dato && klokkeslett && varighet) {
        const fraDato = moment(dato)
            .startOf('day')
            .minute(klokkeslett)
            .toISOString();
        const tilDato = moment(fraDato)
            .add(varighet, 'minutes')
            .toISOString();
        return {
            fraDato,
            tilDato
        };
    }
    return {};
}

export function formatterVarighet(varighet) {
    return moment.duration(varighet, 'minutes').format('h:mm', { trim: false });
}

export function formatterKlokkeslett(klokkeslett) {
    return formatterVarighet(klokkeslett);
}

function moteManglerPubliseringAvSamtalereferat(type, erReferatPublisert) {
    return type === MOTE_TYPE && !erReferatPublisert;
}

function samtalreferatManglerPublisering(type, erReferatPublisert) {
    return type === SAMTALEREFERAT_TYPE && !erReferatPublisert;
}

export function manglerPubliseringAvSamtaleReferat(aktivitet, status) {
    const { type, erReferatPublisert } = aktivitet;
    return (
        !type ||
        (moteManglerPubliseringAvSamtalereferat(type, erReferatPublisert) && status !== STATUS_AVBRUTT) ||
        samtalreferatManglerPublisering(type, erReferatPublisert)
    );
}

function erMoteOgAvbrutt(status, aktivitetType) {
    return status === STATUS_AVBRUTT && aktivitetType === MOTE_TYPE;
}

function erAvtaltOgAvbrutt(erAvtalt, status) {
    return erAvtalt && status === STATUS_AVBRUTT;
}

function erFullfoertUtenReferat(erAvtalt, status, aktivitetType) {
    return (
        erAvtalt && status === STATUS_FULLFOERT && aktivitetType !== SAMTALEREFERAT_TYPE && aktivitetType !== MOTE_TYPE
    );
}

export function trengerBegrunnelse(erAvtalt, status, aktivitetType) {
    return (
        erAvtaltOgAvbrutt(erAvtalt, status) ||
        erFullfoertUtenReferat(erAvtalt, status, aktivitetType) ||
        erMoteOgAvbrutt(status, aktivitetType)
    );
}

export function sorterAktiviteter(aktiviteter, status) {
    return aktiviteter
        .filter(a => {
            if (a.nesteStatus) {
                return a.nesteStatus === status;
            }
            return a.status === status;
        })
        .sort(compareAktivitet);
}

function tilDatoEllerFraDatoerMindreEnnEnManederSiden(aktivitet) {
    return !erMerEnnEnManederSiden(aktivitet);
}

export function splitIEldreOgNyereAktiviteter(aktiviteter) {
    return aktiviteter.reduce(
        ([listeMedAktiviteterTilDatoMindreEnnToManader, listeMedAktiviteterTilDatoMerEnnToManader], aktivitet) => {
            if (tilDatoEllerFraDatoerMindreEnnEnManederSiden(aktivitet)) {
                return [
                    [...listeMedAktiviteterTilDatoMindreEnnToManader, aktivitet],
                    listeMedAktiviteterTilDatoMerEnnToManader
                ];
            }
            return [
                listeMedAktiviteterTilDatoMindreEnnToManader,
                [...listeMedAktiviteterTilDatoMerEnnToManader, aktivitet]
            ];
        },
        [[], []]
    );
}
