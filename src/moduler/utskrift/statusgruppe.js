import React from 'react';
import { FormattedMessage } from 'react-intl';
import Aktivitetsdetaljer from '../aktivitet/visning/hjelpekomponenter/aktivitetsdetaljer';
import * as AppPT from '../../proptypes';
import AktivitetEtikettGruppe from '../../felles-komponenter/aktivitet-etikett/aktivitet-etikett-gruppe';

function StatusGruppe({ gruppe }) {
    const alleAktiviteter = gruppe.aktiviteter.map(aktivitet => {
        const etikett = aktivitet.etikett;
        return (
            <div>
                <h3>
                    {aktivitet.tittel}
                </h3>
                <div>
                    {aktivitet.type}
                </div>

                <AktivitetEtikettGruppe
                    avtalt={aktivitet.avtalt}
                    etikett={etikett}
                    className="aktivitetvisning__etikett"
                />

                <Aktivitetsdetaljer
                    valgtAktivitet={aktivitet}
                    key={aktivitet.id}
                />
            </div>
        );
    });
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
