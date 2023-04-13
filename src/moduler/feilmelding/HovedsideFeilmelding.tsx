import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { selectAktivitetListeFeilMelding } from '../aktivitet/aktivitetlisteSelector';
import { selectDialogFeilmeldinger } from '../dialog/dialog-selector';
import { selectIdentitetFeilMelding } from '../identitet/identitet-selector';
import { selectLestFeilMelding } from '../lest/lest-reducer';
import { selectOppfolgingFeilmeldinger } from '../oppfolging-status/oppfolging-selector';
import { selectNivaa4Feilmeldinger } from '../tilgang/tilgang-selector';
import Feilmelding from './Feilmelding';
import {useFeilMetrikker} from "./useFeilMetrikker";

export default function HovedsideFeilmelding() {
    const oppfFeil = useSelector(selectOppfolgingFeilmeldinger, shallowEqual);
    const identitetFeil = useSelector(selectIdentitetFeilMelding, shallowEqual);
    const aktivitetFeil = useSelector(selectAktivitetListeFeilMelding);
    const lestFeil = useSelector(selectLestFeilMelding, shallowEqual);
    const dialogFeil = useSelector(selectDialogFeilmeldinger, shallowEqual);
    const nivaa4Feil = useSelector(selectNivaa4Feilmeldinger, shallowEqual);

    const alleFeil = oppfFeil.concat(identitetFeil, aktivitetFeil, lestFeil, dialogFeil, nivaa4Feil);

    useFeilMetrikker(alleFeil);

    return <Feilmelding feilmeldinger={alleFeil} className="container" />;
}
