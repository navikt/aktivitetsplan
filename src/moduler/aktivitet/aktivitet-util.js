import 'moment-duration-format';
import { moment } from '../../utils';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../constant';

export function aktivitetEquals(a, b) {
    return (
        a.status === b.status &&
        a.type === b.type &&
        a.etikett === b.etikett &&
        a.avtalt === b.avtalt
    );
}

export function compareAktivitet(a, b) {
    if (b.avtalt && !a.avtalt) {
        return 1;
    } else if (!b.avtalt && a.avtalt) {
        return -1;
    }
    if (a.opprettetDato !== null && b.opprettetDato === null) {
        return -1;
    }
    if (a.opprettetDato === null && b.opprettetDato !== null) {
        return 1;
    }
    return b.opprettetDato.localeCompare(a.opprettetDato);
}

export function beregnKlokkeslettVarighet(aktivitet) {
    const fraDato = aktivitet.fraDato;
    const tilDato = aktivitet.tilDato;
    if (fraDato && tilDato) {
        const fraMoment = moment(fraDato);
        const tilMoment = moment(tilDato);
        const klokkeslett = fraMoment.minutes() + fraMoment.hours() * 60;
        const varighet = moment.duration(tilMoment.diff(fraMoment)).asMinutes();
        return {
            dato: fraMoment.startOf('day').toISOString(),
            klokkeslett,
            varighet,
        };
    }
    return {};
}

export function beregnFraTil(data) {
    const dato = data.dato;
    const klokkeslett = data.klokkeslett;
    const varighet = data.varighet;
    if (dato && klokkeslett && varighet) {
        const fraDato = moment(dato)
            .startOf('day')
            .minute(klokkeslett)
            .toISOString();
        const tilDato = moment(fraDato).add(varighet, 'minutes').toISOString();
        return {
            fraDato,
            tilDato,
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

export function manglerPubliseringAvSamtaleReferat(aktivitet, avbryt) {
    const { type, erReferatPublisert } = aktivitet;
    return (
        !type ||
        (type === MOTE_TYPE && !erReferatPublisert && !avbryt) ||
        (type === SAMTALEREFERAT_TYPE && !erReferatPublisert)
    );
}

export function erGruppeDatoeneLike(fradato, tildato) {
    return moment(fradato).isSame(tildato);
}
