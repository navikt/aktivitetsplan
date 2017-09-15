import moment from 'moment';
import 'moment-duration-format';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../constant';

export function aktivitetEquals(a, b) {
    return (
        a.status === b.status &&
        a.type === b.type &&
        a.etikett === b.etikett &&
        a.avtalt === b.avtalt
    );
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

export function manglerPubliseringAvSamtaleReferat(aktivitet) {
    const { type, erReferatPublisert } = aktivitet;
    return (
        !type ||
        ((type === MOTE_TYPE || type === SAMTALEREFERAT_TYPE) &&
            !erReferatPublisert)
    );
}
