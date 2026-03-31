import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { sorterAktiviteter, splitIEldreOgNyereAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetlisteSelector';
import { selectSortering } from '../../../moduler/filtrering/sortering/sortering-selector';
import { SorteringState } from '../../../moduler/filtrering/sortering/sortering-slice';
import DropTargetKolonne from './DropTargetKolonne';
import KolonneHeader from './KolonneHeader';
import SkjulEldreAktiviteterFraKolonne from './SkjulEldreAktiviteterFraKolonne';

interface Props {
    status: AktivitetStatus.FULLFOERT | AktivitetStatus.AVBRUTT;
}

const KolonneSomSkjulerEldreAktiviteter = ({ status }: Props) => {
    const aktiviteter = useSelector(selectAktivitetListe, shallowEqual);
    const sortering = useSelector(selectSortering) as SorteringState;

    const sorterteAktiviter = sorterAktiviteter(aktiviteter, status, sortering);

    const { nyereAktiviteter, eldreAktiviteter } = splitIEldreOgNyereAktiviteter(sorterteAktiviter);

    const aktivitetsListe = nyereAktiviteter.map((aktivitet: AlleAktiviteter) => (
        <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />
    ));

    const aktivitetTekst =
        status === AktivitetStatus.FULLFOERT ? 'eldre fullførte aktiviteter' : 'eldre avbrutte aktiviteter';

    return (
        <DropTargetKolonne status={status}>
            <KolonneHeader status={status} />
            <div>
                {aktivitetsListe}
                <SkjulEldreAktiviteterFraKolonne
                    aktivitetTekst={aktivitetTekst}
                    aktiviteteterTilDatoMerEnnToManederSiden={eldreAktiviteter}
                />
            </div>
        </DropTargetKolonne>
    );
};

export default KolonneSomSkjulerEldreAktiviteter;
