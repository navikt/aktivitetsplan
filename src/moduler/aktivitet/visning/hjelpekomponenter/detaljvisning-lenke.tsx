import React from 'react';

import DetaljFelt from './detalj-felt';
import ForkortetLenke from './ForkortetLenke';

interface Props {
    lenke?: string;
}

const DetaljvisningLenke = ({ lenke }: Props) => (
    <DetaljFelt key="lenke" tittel="Lenke" fullbredde>
        <ForkortetLenke lenke={lenke} />
    </DetaljFelt>
);

export default DetaljvisningLenke;
