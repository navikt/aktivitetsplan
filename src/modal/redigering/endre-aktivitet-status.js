import React, { PropTypes as PT } from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-react-design/dist/typografi';

function Status({ statusId, tekstId }) {
    const htmlId = `aktivitet-status-${statusId}`;
    return (
        <span className="endre-aktivitet-status__status">
            <Field
                name="status"
                type="radio"
                className="nav-radioknapp nav-radioknapp-vannrett"
                component="input"
                value={statusId}
                required
                id={htmlId}
            />
            <label htmlFor={htmlId} className="endre-aktivitet-status__status-label">
                <FormattedMessage id={tekstId} />
            </label>
        </span>
    );
}

Status.propTypes = {
    statusId: PT.string.isRequired,
    tekstId: PT.string.isRequired
};


export default () => (
    <section className="endre-aktivitet-status">
        <Undertittel><FormattedMessage id="aktivitet.status" /></Undertittel>
        <Status statusId="BRUKER_ER_INTERESSERT" tekstId="aktivitetstavle.brukerErInteressert" />
        <Status statusId="PLANLAGT" tekstId="aktivitetstavle.planlagt" />
        <Status statusId="GJENNOMFOERT" tekstId="aktivitetstavle.gjennomfoert" />
        <Status statusId="FULLFOERT" tekstId="aktivitetstavle.fullfoert" />
        <Status statusId="AVBRUTT" tekstId="aktivitetstavle.avbrutt" />
    </section>
);
