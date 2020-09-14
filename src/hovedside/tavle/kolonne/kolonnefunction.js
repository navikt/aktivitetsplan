import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import KolonneHeader from './kolonneheader';
import DropTargetKolonne from './drop-target-kolonne';
import { sorterAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../../moduler/aktivitet/aktivitetliste-selector';

function KolonneFunction({ status, aktiviteter, render }) {
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
    aktiviteter: PT.arrayOf(PT.object).isRequired,
    render: PT.func.isRequired,
};

const mapStateToProps = (state) => ({
    aktiviteter: selectAktivitetListe(state),
});

export default connect(mapStateToProps)(KolonneFunction);
