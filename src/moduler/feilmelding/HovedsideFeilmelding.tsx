import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { selectAktivitetListeFeilMelding } from '../aktivitet/aktivitetliste-selector';
import { selectDialogFeilmeldinger } from '../dialog/dialog-selector';
import { selectIdentitetFeilMelding } from '../identitet/identitet-selector';
import { selectLestFeilMelding } from '../lest/lest-reducer';
import { selectOppfolgingFeilmeldinger } from '../oppfolging-status/oppfolging-selector';
import Feilmelding from './Feilmelding';

export default function HovedsideFeilmelding() {
    const oppfFeil = useSelector(selectOppfolgingFeilmeldinger, shallowEqual);
    const identitetFeil = useSelector(selectIdentitetFeilMelding, shallowEqual);
    const aktivitetFeil = useSelector(selectAktivitetListeFeilMelding);
    const lestFeil = useSelector(selectLestFeilMelding, shallowEqual);
    const dialogFeil = useSelector(selectDialogFeilmeldinger, shallowEqual);

    const alleFeil = oppfFeil.concat(identitetFeil, aktivitetFeil, lestFeil, dialogFeil);

    return <Feilmelding feilmeldinger={alleFeil} className="container" />;
}
