import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import DragbartAktivitetskort from '../../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import { sorterAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetlisteSelector';
import { selectSorteringForKolonne } from '../../../moduler/filtrering/sortering/sortering-selector';
import { SorteringState } from '../../../moduler/filtrering/sortering/sortering-slice';
import DropTargetKolonne from './DropTargetKolonne';
import KolonneHeader from './KolonneHeader';

interface Props {
    status: Exclude<AktivitetStatus, AktivitetStatus.FULLFOERT | AktivitetStatus.AVBRUTT>;
}

const Kolonne = ({ status }: Props) => {
    const aktiviteter = useSelector(selectAktivitetListe, shallowEqual);
    const sortering = useSelector(selectSorteringForKolonne(status)) as SorteringState;
    const sorterteAktiviter = sorterAktiviteter(aktiviteter, status, sortering);
    const aktivitetsListe = sorterteAktiviter.map((aktivitet) => (
        <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />
    ));

    return (
        <DropTargetKolonne status={status}>
            <KolonneHeader status={status} />
            {aktivitetsListe}
        </DropTargetKolonne>
    );
};

export default Kolonne;
