import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { sorterAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetlisteSelector';
import { AktivitetStatus } from '../../../types';
import DropTargetKolonne from './DropTargetKolonne';
import KolonneHeader from './kolonneheader';

interface Props {
    status: AktivitetStatus;
}

function Kolonne({ status }: Props) {
    const aktiviteter = useSelector(selectAktivitetListe, shallowEqual);

    const sorterteAktiviter = sorterAktiviteter(aktiviteter, status);
    const aktivitetsListe = sorterteAktiviter.map((aktivitet) => (
        <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />
    ));

    return (
        <DropTargetKolonne status={status}>
            <KolonneHeader status={status} />
            {aktivitetsListe}
        </DropTargetKolonne>
    );
}

export default Kolonne;
