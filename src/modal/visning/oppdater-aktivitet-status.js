import React, { PropTypes as PT } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import Undertittel from 'nav-frontend-typografi/src/undertittel';
import Bilde from 'nav-react-design/dist/bilde';
import * as aktivitetstatus from '../../constant';
import Radio from '../skjema/input/radio';
import hengelasSVG from '../../img/hengelas.svg';

const leggTilHengelas = (tekst, altTekst) => (
    <span>
        {tekst}&nbsp;&nbsp;<Bilde style={{ position: 'absolute' }} src={hengelasSVG} alt={altTekst} />
    </span>
);

function OppdaterAktivitetStatus(props) {
    const erChecked = (id) => props.valgtStatus === id;
    const disableStatusEndring = props.status === aktivitetstatus.STATUS_AVBRUTT ||
        props.status === aktivitetstatus.STATUS_FULLFOERT;

    const hengelasAlt = props.intl.formatMessage('hengelas-icon-alt');

    const radioSkjema = (
        <form className="skjema blokk-m oppdaterstatus-skjema">
            <Radio
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.brukerErInteressert" />}
                value={aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT}
                id={`id--${aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.planlagt" />}
                value={aktivitetstatus.STATUS_PLANLAGT}
                id={`id--${aktivitetstatus.STATUS_PLANLAGT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_PLANLAGT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.gjennomfoert" />}
                value={aktivitetstatus.STATUS_GJENNOMFOERT}
                id={`id--${aktivitetstatus.STATUS_GJENNOMFOERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_GJENNOMFOERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas(<FormattedMessage id="aktivitetstavle.fullfoert" />, hengelasAlt)}
                value={aktivitetstatus.STATUS_FULLFOERT}
                id={`id--${aktivitetstatus.STATUS_FULLFOERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_FULLFOERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas(<FormattedMessage id="aktivitetstavle.avbrutt" />, hengelasAlt)}
                value={aktivitetstatus.STATUS_AVBRUTT}
                id={`id--${aktivitetstatus.STATUS_AVBRUTT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_AVBRUTT)}
                disabled={disableStatusEndring}
            />
        </form>
    );

    return (
        <section className={props.className}>
            <Undertittel className="blokk-s">
                Oppdater status
            </Undertittel>
            {radioSkjema}
        </section>
    );
}

const OppdaterStatusReduxForm = reduxForm({
    form: 'oppdaterStatus-form'
})(OppdaterAktivitetStatus);

OppdaterAktivitetStatus.propTypes = {
    status: PT.string.isRequired,
    valgtStatus: PT.string,
    className: PT.string,
    intl: intlShape
};

const mapStateToProps = (state, props) => ({
    aktiviteter: state.data.aktiviteter.data,
    valgtStatus: formValueSelector('oppdaterStatus-form')(state, 'aktivitetstatus'),
    initialValues: {
        aktivitetstatus: props.status
    }
});


export default connect(mapStateToProps, null)(injectIntl(OppdaterStatusReduxForm));
