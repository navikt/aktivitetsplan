import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';
import Aktivitetsdetaljer from '../aktivitet/visning/hjelpekomponenter/aktivitetsdetaljer';
import * as AppPT from '../../proptypes';
import AktivitetEtikettGruppe from '../../felles-komponenter/aktivitet-etikett/aktivitet-etikett-gruppe';

function AktivitetPrint({ aktivitet }) {
    const { id, type, tittel } = aktivitet;
    return (
        <div key={id}>
            <Element
                tag="h2"
                className="printmodal-body__statusgruppe-overskrift"
            >
                {tittel}
            </Element>
            <div>
                {type}
            </div>

            <AktivitetEtikettGruppe
                aktivitet={aktivitet}
                className="printmodal-body__aktivitetvisning-etikett"
            />

            <Aktivitetsdetaljer valgtAktivitet={aktivitet} key={id} />
        </div>
    );
}

AktivitetPrint.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

function StatusGruppe({ gruppe }) {
    const { status, aktiviteter } = gruppe;
    return (
        <section className="printmodal-body__statusgruppe">
            <Undertittel tag="h1">
                <FormattedMessage
                    id={`aktivitetstavle.print.${status.toLowerCase()}`}
                />
            </Undertittel>
            {aktiviteter.map(aktivitet =>
                <AktivitetPrint aktivitet={aktivitet} key={aktivitet.id} />
            )}
        </section>
    );
}

StatusGruppe.propTypes = {
    gruppe: PT.shape({
        status: PT.string.isRequired,
        aktiviteter: AppPT.aktiviteter.isRequired,
    }),
};

StatusGruppe.defaultProps = {
    gruppe: null,
};

export default StatusGruppe;
