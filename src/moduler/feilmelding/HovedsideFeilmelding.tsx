import * as React from 'react';
import { selectAktivitetListeFeilMelding } from '../aktivitet/aktivitetliste-selector';
import { selectIdentitetFeilMelding } from '../identitet/identitet-selector';
import { selectOppfolgingFeilmeldinger } from '../oppfolging-status/oppfolging-selector';
import Feilmelding from './Feilmelding';
import { selectLestFeilMelding } from '../lest/lest-reducer';
import { selectDialogFeilmeldinger } from '../dialog/dialog-selector';
import { useSelector, shallowEqual } from 'react-redux';

export default function HovedsideFeilmelding() {
    const oppfFeil = useSelector(selectOppfolgingFeilmeldinger, shallowEqual);
    const identitetFeil = useSelector(selectIdentitetFeilMelding, shallowEqual);
    const aktivitetFeil = useSelector(selectAktivitetListeFeilMelding);
    const lestFeil = useSelector(selectLestFeilMelding, shallowEqual);
    const dialogFeil = useSelector(selectDialogFeilmeldinger, shallowEqual);

    const alleFeil = oppfFeil.concat(identitetFeil, aktivitetFeil, lestFeil, dialogFeil);

    return <Feilmelding feilmeldinger={alleFeil} className="container" />;
}
