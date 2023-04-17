import * as React from 'react';
import { useSelector } from 'react-redux';

import { selectHovedsideFeil } from './feil-selector';
import Feilmelding from './Feilmelding';

export default function HovedsideFeilmelding() {
    const alleFeil = useSelector(selectHovedsideFeil);
    return <Feilmelding feilmeldinger={alleFeil} />;
}
