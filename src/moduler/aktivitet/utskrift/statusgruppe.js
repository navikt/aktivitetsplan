import React from 'react';
import { FormattedMessage } from 'react-intl';
import Aktivitetsdetaljer from '../visning/hjelpekomponenter/aktivitetsdetaljer';
import * as AppPT from '../../../proptypes';

function StatusGruppe({ gruppe }) {
    const alleAktiviteter = gruppe.aktiviteter.map(aktivitet =>
        <Aktivitetsdetaljer valgtAktivitet={aktivitet} />
    );
    return (
        <div>
            <h2 className="typo-undertittel">
                <FormattedMessage
                    id={`aktivitetstavle.print.${gruppe.status.toLowerCase()}`}
                />
            </h2>
            {alleAktiviteter}
        </div>
    );
}

StatusGruppe.propTypes = {
    gruppe: AppPT.aktiviteter.isRequired,
};

export default StatusGruppe;
