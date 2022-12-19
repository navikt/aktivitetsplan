import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../constant';
import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { sorterAktiviteter, splitIEldreOgNyereAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetlisteSelector';
import DropTargetKolonne from './DropTargetKolonne';
import KolonneHeader from './KolonneHeader';
import SkjulEldreAktiviteterFraKolonne from './SkjulEldreAktiviteterFraKolonne';

interface Props {
    status: typeof STATUS_FULLFOERT | typeof STATUS_AVBRUTT;
}

function aktivitetTekst(status: typeof STATUS_FULLFOERT | typeof STATUS_AVBRUTT): string {
    switch (status) {
        case 'FULLFORT':
            return 'eldre fullførte aktiviteter';
        case 'AVBRUTT':
            return 'eldre avbrutte aktiviteter';
    }
}

function KolonneSomSkjulerEldreAktiviteter({ status }: Props) {
    const aktiviteter = useSelector(selectAktivitetListe, shallowEqual);

    const sorterteAktiviter = sorterAktiviteter(aktiviteter, status);

    const { nyereAktiviteter, eldreAktiviteter } = splitIEldreOgNyereAktiviteter(sorterteAktiviter);

    const aktivitetsListe = nyereAktiviteter.map((aktivitet: AlleAktiviteter) => (
        <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />
    ));

    return (
        <DropTargetKolonne status={status}>
            <KolonneHeader status={status} />
            <div>
                {aktivitetsListe}
                <SkjulEldreAktiviteterFraKolonne
                    aktivitetTekst={aktivitetTekst(status)}
                    aktiviteteterTilDatoMerEnnToManederSiden={eldreAktiviteter}
                />
            </div>
        </DropTargetKolonne>
    );
}

export default KolonneSomSkjulerEldreAktiviteter;
