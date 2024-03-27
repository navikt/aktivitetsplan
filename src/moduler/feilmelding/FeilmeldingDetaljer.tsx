import React from 'react';

import { SerializedError } from '../../api/utils';
import { hentAktiviteter } from '../aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { hentIdentitet } from '../identitet/identitet-slice';
import { hentLest } from '../lest/lest-slice';
import { hentOppfolging } from '../oppfolging-status/oppfolging-slice';

interface PropTypes {
    feil: SerializedError & { type: string };
}

const feilmeldingMap: Record<string, any> = {
    [hentOppfolging.rejected.type]: 'Kunne ikke hente oppfolgings-status',
    [hentIdentitet.rejected.type]: 'Kunne ikke hente identitet',
    [hentAktiviteter.rejected.type]: 'Kunne ikke hente aktivteter',
    [hentArenaAktiviteter.rejected.type]: 'Kunne ikke hente arena-aktivteter',
    [hentLest.rejected.type]: 'Kunne ikke hente lest-status',
    [hentDialoger.rejected.type]: 'Kunne ikke hente dialoger',
};

export default function FeilmeldingDetalj(props: PropTypes) {
    const { message, name, type } = props.feil;
    const tittel = feilmeldingMap[type] || type;

    return (
        <div className="border border-border-default m-4 p-4 rounded-md">
            <h2 className="font-bold">{tittel}</h2>
            <div>{name}</div>
            <div className="break-words">{message}</div>
        </div>
    );
}
