import * as React from 'react';
import { useSelector } from 'react-redux';

import { selectHovedsideFeil } from './feil-selector';
import Feilmelding from './Feilmelding';
import {useFeilMetrikker} from "./useFeilMetrikker";

export default function HovedsideFeilmelding() {
    const alleFeil = useSelector(selectHovedsideFeil);
    useFeilMetrikker(alleFeil);
    return <Feilmelding feilmeldinger={alleFeil} />;
}
