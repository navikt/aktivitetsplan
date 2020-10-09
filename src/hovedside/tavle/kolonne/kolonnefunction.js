import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PT from 'prop-types';
import KolonneHeader from './kolonneheader';
import DropTargetKolonne from './DropTargetKolonne';
import { sorterAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetliste-selector';

function KolonneFunction({ status, render }) {
    const aktiviteter = useSelector(selectAktivitetListe, shallowEqual);
    const sorterteAktiviter = sorterAktiviteter(aktiviteter, status);
    return (
        <DropTargetKolonne status={status}>
            <KolonneHeader status={status} />
            {render(sorterteAktiviter)}
        </DropTargetKolonne>
    );
}

KolonneFunction.propTypes = {
    status: PT.string.isRequired,
    render: PT.func.isRequired,
};

export default KolonneFunction;
