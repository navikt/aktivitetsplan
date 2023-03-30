import { Select } from '@navikt/ds-react';
import React from 'react';

import { LocalStorageElement, settLocalStorage } from './sessionstorage';

const hurtigfilterType = [
    {
        id: 'nyBrukerStdOrd',
        name: 'Ny bruker - Standard innsats',
        avskrudd: [
            LocalStorageElement.INGEN_OPPF_PERIODER,
            LocalStorageElement.PRIVAT_BRUKER,
            LocalStorageElement.MANUELL_BRUKER,
            LocalStorageElement.ARENA_AKTIVITETER,
            LocalStorageElement.TEST_AKTIVITETER,
        ],
        paskrudd: [LocalStorageElement.AUTOMATISKE_AKTIVITETER],
    },
];

const markerValg = (tilstander: any) => {
    tilstander.forEach((x: any) => settLocalStorage(x, true));
};

const skruAvValg = (tilstander: any) => {
    tilstander.forEach((x: any) => settLocalStorage(x, false));
};

const Hurtigfilter = () => {
    return (
        <div className="ml-2">
            <legend className="skjema__legend">Hurtigfilter</legend>
            <Select
                label=""
                onChange={(e) => {
                    const valgtFilter = hurtigfilterType.find((x) => x.id === e.target.value);
                    markerValg(valgtFilter?.paskrudd);
                    skruAvValg(valgtFilter?.avskrudd);
                    window.location.reload();
                }}
            >
                <option>Ingen valgt</option>
                {hurtigfilterType.map((hurtigfilter) => (
                    <option value={hurtigfilter.id} key={hurtigfilter.id}>
                        {hurtigfilter.name}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default Hurtigfilter;
