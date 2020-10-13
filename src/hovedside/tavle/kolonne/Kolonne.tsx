import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import KolonneHeader from './kolonneheader';
import DropTargetKolonne from './DropTargetKolonne';
import { sorterAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetliste-selector';
import { AktivitetStatus } from '../../../types';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';

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
