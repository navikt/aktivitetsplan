import React from 'react';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import type { TavleAktivitet } from '../Aktivitetskolonner';
import DropTargetKolonne from './DropTargetKolonne';
import KolonneHeader from './KolonneHeader';

interface Props {
    status: Exclude<AktivitetStatus, AktivitetStatus.FULLFOERT | AktivitetStatus.AVBRUTT>;
    aktiviteter: TavleAktivitet[];
}

const Kolonne = ({ status, aktiviteter }: Props) => {
    const aktivitetsListe = aktiviteter.map((aktivitet, index) => (
        <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} group={status} index={index} />
    ));

    return (
        <DropTargetKolonne status={status}>
            <KolonneHeader status={status} />
            {aktivitetsListe}
        </DropTargetKolonne>
    );
};

export default Kolonne;
