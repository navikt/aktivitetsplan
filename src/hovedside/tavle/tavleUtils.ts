import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../constant';
import { AktivitetStatus, AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';

export function erDroppbar(
    aktivitet: AlleAktiviteter & { nesteStatus?: string },
    erBruker: boolean,
    erReadMode: boolean,
) {
    const { type, status, nesteStatus } = aktivitet;
    const erArenaAktivitet = isArenaAktivitet(aktivitet);
    const erEksternAktivitet = type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE;
    const historisk = !erArenaAktivitet ? aktivitet.historisk : false;
    const erFerdig = [AktivitetStatus.FULLFOERT, AktivitetStatus.AVBRUTT].includes(status);
    const brukerKanOppdater = [SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker;
    return (
        !erReadMode &&
        !nesteStatus &&
        !historisk &&
        !erFerdig &&
        !erArenaAktivitet &&
        !brukerKanOppdater &&
        !erEksternAktivitet
    );
}
