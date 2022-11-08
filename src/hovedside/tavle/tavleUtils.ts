import { MOTE_TYPE, SAMTALEREFERAT_TYPE, STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../constant';
import { AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';

export function erDroppbar(
    aktivitet: AlleAktiviteter & { nesteStatus?: string },
    erBruker: boolean,
    underOppfolging: boolean
) {
    const { type, status, nesteStatus } = aktivitet;
    const erArenaAktivitet = isArenaAktivitet(aktivitet);
    const historisk = !erArenaAktivitet ? aktivitet.historisk : false;
    const erFerdig = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const brukerKanOppdater = [SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker;
    return underOppfolging && !nesteStatus && !historisk && !erFerdig && !erArenaAktivitet && !brukerKanOppdater;
}
