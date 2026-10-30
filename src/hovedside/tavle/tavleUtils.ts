import type { DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../constant';
import { AktivitetStatus, AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';

export function aktivitetDropTargetStatus({ target }: Partial<Pick<DragEndEvent['operation'], 'source' | 'target'>>) {
    // Use the rendered group, which can differ from the activity's persisted status during preview.
    const group = target && isSortable(target) ? target.sortable.group : target?.id;
    return Object.values(AktivitetStatus).find((status) => group === `aktivitetskolonne-${status}` || group === status);
}

export function erDroppbar(aktivitet: AlleAktiviteter, erBruker: boolean, erReadMode: boolean) {
    const { type, status } = aktivitet;
    const erArenaAktivitet = isArenaAktivitet(aktivitet);
    const erEksternAktivitet = type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE;
    const historisk = !erArenaAktivitet ? aktivitet.historisk : false;
    const erFerdig = [AktivitetStatus.FULLFOERT, AktivitetStatus.AVBRUTT].includes(status);
    const brukerKanOppdatere = [SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker;
    return !erReadMode && !historisk && !erFerdig && !erArenaAktivitet && !brukerKanOppdatere && !erEksternAktivitet;
}
