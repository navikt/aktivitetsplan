import Select from 'nav-frontend-skjema/lib/select';
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

class Hurtigfilter extends React.Component {
    markerValg = (tilstander) => {
        tilstander.forEach((x) => settLocalStorage(x, true));
    };

    skruAvValg = (tilstander) => {
        tilstander.forEach((x) => settLocalStorage(x, false));
    };

    filterValg = () => {
        return hurtigfilterType.map((x) => (
            <option value={x.id} key={x.id}>
                {x.name}
            </option>
        ));
    };

    render() {
        return (
            <div className="inputPanelGruppe">
                <legend className="skjema__legend">Hurtigfilter</legend>
                <Select
                    label=""
                    onChange={(e) => {
                        const valgtFilter = hurtigfilterType.find((x) => x.id === e.target.value);
                        this.markerValg(valgtFilter.paskrudd);
                        this.skruAvValg(valgtFilter.avskrudd);
                        window.location.reload();
                    }}
                >
                    <option>Ingen valgt</option>
                    {this.filterValg()}
                </Select>
            </div>
        );
    }
}

export default Hurtigfilter;
