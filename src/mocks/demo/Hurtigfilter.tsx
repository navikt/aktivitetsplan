import { Select } from '@navikt/ds-react';
import React from 'react';

import { LocalStorageElement, settLocalStorage } from './localStorage';

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

const markerValg = (tilstander: LocalStorageElement[]) => {
    tilstander.forEach((tilstand) => settLocalStorage(tilstand, true));
};

const skruAvValg = (tilstander: LocalStorageElement[]) => {
    tilstander.forEach((tilstand) => settLocalStorage(tilstand, false));
};

const Hurtigfilter = () => {
    return (
        <div className="ml-2">
            <legend>Hurtigfilter</legend>
            <Select
                label=""
                onChange={(e) => {
                    const valgtFilter = hurtigfilterType.find((x) => x.id === e.target.value);
                    if (valgtFilter !== undefined) {
                        markerValg(valgtFilter.paskrudd);
                        skruAvValg(valgtFilter.avskrudd);
                        window.location.reload();
                    }
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
