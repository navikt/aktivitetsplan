import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import KolonneHeader from './kolonneheader';
import DropTargetKolonne from './DropTargetKolonne';
import { sorterAktiviteter, splitIEldreOgNyereAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetliste-selector';
import { Aktivitet, AktivitetStatus } from '../../../types';
import SkjulEldreAktiviteter from './SkjulEldreAktiviteterFraKolonne';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';

interface Props {
    status: AktivitetStatus;
}

function KolonneSomSkjulerEldreAktiviteter({ status }: Props) {
    const aktiviteter = useSelector(selectAktivitetListe, shallowEqual);

    const sorterteAktiviter = sorterAktiviteter(aktiviteter, status);

    const { nyereAktiviteter, eldreAktiviteter } = splitIEldreOgNyereAktiviteter(sorterteAktiviter);

    const aktivitetsListe = nyereAktiviteter.map((aktivitet: Aktivitet) => (
        <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />
    ));

    return (
        <DropTargetKolonne status={status}>
            <KolonneHeader status={status} />
            <div>
                {aktivitetsListe}
                <SkjulEldreAktiviteter aktiviteteterTilDatoMerEnnToManederSiden={eldreAktiviteter} />
            </div>
        </DropTargetKolonne>
    );
}

export default KolonneSomSkjulerEldreAktiviteter;
