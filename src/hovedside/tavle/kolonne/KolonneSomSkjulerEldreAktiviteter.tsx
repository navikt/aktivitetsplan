import React from 'react';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { splitIEldreOgNyereAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import type { TavleAktivitet } from '../Aktivitetskolonner';
import DropTargetKolonne from './DropTargetKolonne';
import KolonneHeader from './KolonneHeader';
import SkjulEldreAktiviteterFraKolonne from './SkjulEldreAktiviteterFraKolonne';

interface Props {
    status: AktivitetStatus.FULLFOERT | AktivitetStatus.AVBRUTT;
    aktiviteter: TavleAktivitet[];
}

const KolonneSomSkjulerEldreAktiviteter = ({ status, aktiviteter }: Props) => {
    const previewAktiviteter = aktiviteter.filter((aktivitet) => aktivitet.status !== status);
    const { nyereAktiviteter, eldreAktiviteter } = splitIEldreOgNyereAktiviteter(
        aktiviteter.filter((aktivitet) => aktivitet.status === status),
    );
    const synligeAktiviteter = [...previewAktiviteter, ...nyereAktiviteter];

    const aktivitetsListe = synligeAktiviteter.map((aktivitet: AlleAktiviteter, index) => (
        <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} group={status} index={index} />
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
                    status={status}
                    startIndex={synligeAktiviteter.length}
                />
            </div>
        </DropTargetKolonne>
    );
};

export default KolonneSomSkjulerEldreAktiviteter;
