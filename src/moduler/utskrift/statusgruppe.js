import React from 'react';
import { FormattedMessage } from 'react-intl';
import Aktivitetsdetaljer from '../aktivitet/visning/hjelpekomponenter/aktivitetsdetaljer';
import * as AppPT from '../../proptypes';

function StatusGruppe({ gruppe }) {
    const alleAktiviteter = gruppe.aktiviteter.map(aktivitet =>
        <Aktivitetsdetaljer valgtAktivitet={aktivitet} />
    );
    return (
        <section className="statusgruppe">
            <h1 className="typo-undertittel">
                <FormattedMessage
                    id={`aktivitetstavle.print.${gruppe.status.toLowerCase()}`}
                />
            </h1>
            {alleAktiviteter}
        </section>
    );
}

StatusGruppe.propTypes = {
    gruppe: AppPT.aktiviteter.isRequired,
};

export default StatusGruppe;
