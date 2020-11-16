import Select from 'nav-frontend-skjema/lib/select';
import React from 'react';

import { SessionStorageElement, settSessionStorage } from './sessionstorage';

const hurtigfilterType = [
    {
        id: 'nyBrukerStdOrd',
        name: 'Ny bruker - Standard innsats',
        avskrudd: [
            SessionStorageElement.INGEN_OPPF_PERIODER,
            SessionStorageElement.PRIVAT_BRUKER,
            SessionStorageElement.MANUELL_BRUKER,
            SessionStorageElement.ARENA_AKTIVITETER,
            SessionStorageElement.TEST_AKTIVITETER,
        ],
        paskrudd: [SessionStorageElement.AUTOMATISKE_AKTIVITETER],
    },
];

class Hurtigfilter extends React.Component {
    markerValg = (tilstander) => {
        tilstander.forEach((x) => settSessionStorage(x, true));
    };

    skruAvValg = (tilstander) => {
        tilstander.forEach((x) => settSessionStorage(x, false));
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
