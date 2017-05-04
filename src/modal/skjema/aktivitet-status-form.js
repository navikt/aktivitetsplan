import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import Bilde from 'nav-react-design/dist/bilde';
import * as statuser from '../../constant';
import Radio from './input/radio';
import hengelasSVG from '../../img/hengelas.svg';
import { flyttAktivitet } from '../../ducks/aktiviteter';
import history from '../../history';
import { aktivitet as aktivitetPT } from '../../proptypes';

const leggTilHengelas = (tekst) => (
    <span>
        {tekst}&nbsp;&nbsp;<Bilde style={{ position: 'absolute' }} src={hengelasSVG} alt="hengelås ikon" />
    </span>
);

function AktivitetStatusForm(props) {
    const { aktivitet } = props;
    const onChange = (event) => {
        const valgtAktivitetStatus = event.currentTarget.value;
        if (valgtAktivitetStatus === statuser.STATUS_FULLFOERT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/fullfor`);
        } else if (valgtAktivitetStatus === statuser.STATUS_AVBRUTT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/avbryt`);
        } else {
            props.flyttAktivitet(aktivitet, valgtAktivitetStatus);
        }
        return null;
    };
    const erAktivitetChecked = (statusId) => props.valgtAktivitetStatus === statusId;
    return (
        <form className="skjema oppdaterstatus-skjema">
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.brukerErInteressert" />}
                value={statuser.STATUS_BRUKER_ER_INTRESSERT}
                id={`id--${statuser.STATUS_BRUKER_ER_INTRESSERT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_BRUKER_ER_INTRESSERT)}
                disabled={props.disableStatusEndring}
            />
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.planlagt" />}
                value={statuser.STATUS_PLANLAGT}
                id={`id--${statuser.STATUS_PLANLAGT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_PLANLAGT)}
                disabled={props.disableStatusEndring}
            />
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.gjennomfoert" />}
                value={statuser.STATUS_GJENNOMFOERT}
                id={`id--${statuser.STATUS_GJENNOMFOERT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_GJENNOMFOERT)}
                disabled={props.disableStatusEndring}
            />
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas(<FormattedMessage id="aktivitetstavle.fullfoert" />)}
                value={statuser.STATUS_FULLFOERT}
                id={`id--${statuser.STATUS_FULLFOERT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_FULLFOERT)}
                disabled={props.disableStatusEndring}
            />
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas(<FormattedMessage id="aktivitetstavle.avbrutt" />)}
                value={statuser.STATUS_AVBRUTT}
                id={`id--${statuser.STATUS_AVBRUTT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_AVBRUTT)}
                disabled={props.disableStatusEndring}
            />
        </form>
    );
}

const OppdaterReduxForm = reduxForm({
    form: 'aktivitet-status-form'
})(AktivitetStatusForm);

AktivitetStatusForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired,
    valgtAktivitetStatus: PT.string.isRequired,
    aktivitet: aktivitetPT.isRequired
};

const mapStateToProps = (state, props) => ({
    flyttAktivitet: PT.func.isRequired,
    valgtAktivitetStatus: formValueSelector('aktivitet-status-form')(state, 'aktivitetstatus'),
    initialValues: {
        aktivitetstatus: props.aktivitet.status
    }
});

const mapDispatchToProps = (dispatch) => ({
    flyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterReduxForm);
