import { Alert } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

import { SerializedError } from '../../api/utils';
import { flyttAktivitet, hentAktivitet, hentAktiviteter, publiserReferat } from '../aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { oppdaterMal } from '../mal/aktivitetsmal-slice';

export const getErrorText = (feilmeldinger: SerializedError[]) => {
    const antallFeil = feilmeldinger.length;
    const feil = feilmeldinger[0];

    switch (feil.code) {
        case '401':
            return 'Du er blitt logget ut. Ta vare på alt ulagret arbeid før du logger inn ved å laste siden på nytt.';
        case '403':
            return 'Noe gikk dessverre galt med aktivitetsplanen. Du har ikke tilgang til å se dette';
    }

    if (antallFeil > 1) {
        return 'Noe gikk dessverre galt med aktivitetsplanen. Prøv igjen senere.';
    }

    switch (feil.type) {
        case hentAktiviteter.rejected.type:
        case hentAktivitet.rejected.type:
        case hentArenaAktiviteter.rejected.type:
            return 'Noe gikk galt, og du får dessverre ikke sett alle aktiviteter. Prøv igjen senere.';
        case hentDialoger.rejected.type:
            return 'Noe gikk galt, og du får dessverre ikke sett dialogmeldinger. Prøv igjen senere.';
        case flyttAktivitet.rejected.type:
            return 'Noe gikk galt, og du får dessverre ikke oppdatert status på aktiviteten. Prøv igjen senere.';
        case oppdaterMal.rejected.type:
            return 'Noe gikk galt, og du får dessverre ikke oppdatert mål. Prøv igjen senere.';
        case publiserReferat.rejected.type:
            return 'Noe gikk dessverre galt med deling av referat. Prøv igjen senere.';
        default:
            return 'Noe gikk dessverre galt med aktivitetsplanen. Prøv igjen senere.';
    }
};

interface Props {
    feilmeldinger: SerializedError[];
    inline?: boolean;
}

export default function Feilmelding(props: Props) {
    const { feilmeldinger, inline = false } = props;

    if (feilmeldinger.length === 0) {
        return null;
    }

    const tekst = getErrorText(feilmeldinger);

    return (
        <div className={classNames('my-4')}>
            <Alert variant="error" inline={inline}>
                {tekst}
            </Alert>
        </div>
    );
}
