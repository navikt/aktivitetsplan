import React from 'react';

import CustomBodyLong from './CustomBodyLong';
import DetaljFelt from './detalj-felt';

interface Props {
    lenke?: string;
}

const DetaljvisningLenke = ({ lenke }: Props) => (
    <DetaljFelt key="lenke" tittel="Lenke" fullbredde>
        <CustomBodyLong formatLinks>{lenke}</CustomBodyLong>
    </DetaljFelt>
);

export default DetaljvisningLenke;
