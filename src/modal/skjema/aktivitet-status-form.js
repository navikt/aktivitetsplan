import React from 'react';
import PT from 'prop-types'
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Bilde from 'nav-react-design/dist/bilde';
import * as statuser from '../../constant';
import Radio from './input/radio';
import hengelasSVG from '../../img/hengelas.svg';
import { flyttAktivitet } from '../../ducks/aktiviteter';
import history from '../../history';
import { aktivitet as aktivitetPT } from '../../proptypes';
import { STATUS } from '../../ducks/utils';

const leggTilHengelas = (tekst, altTekst) => (
    <span>
        {tekst}&nbsp;&nbsp;<Bilde style={{ position: 'absolute' }} src={hengelasSVG} alt={altTekst} />
    </span>
);

function AktivitetStatusForm(props) {
    const { aktivitet, doFlyttAktivitet, aktivitetDataStatus } = props;
    const lasterData = aktivitetDataStatus !== STATUS.OK;
    const hengelasAlt = props.intl.formatMessage({ id: 'hengelas-icon-alt' });
    const onChange = (event) => {
        const valgtAktivitetStatus = event.currentTarget.value;
        if (valgtAktivitetStatus === statuser.STATUS_FULLFOERT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/fullfor`);
        } else if (valgtAktivitetStatus === statuser.STATUS_AVBRUTT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/avbryt`);
        } else {
            doFlyttAktivitet(aktivitet, valgtAktivitetStatus);
        }
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
                disabled={props.disableStatusEndring || lasterData}
            />
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.planlagt" />}
                value={statuser.STATUS_PLANLAGT}
                id={`id--${statuser.STATUS_PLANLAGT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_PLANLAGT)}
                disabled={props.disableStatusEndring || lasterData}
            />
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.gjennomfoert" />}
                value={statuser.STATUS_GJENNOMFOERT}
                id={`id--${statuser.STATUS_GJENNOMFOERT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_GJENNOMFOERT)}
                disabled={props.disableStatusEndring || lasterData}
            />
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas(<FormattedMessage id="aktivitetstavle.fullfoert" />, hengelasAlt)}
                value={statuser.STATUS_FULLFOERT}
                id={`id--${statuser.STATUS_FULLFOERT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_FULLFOERT)}
                disabled={props.disableStatusEndring || lasterData}
            />
            <Radio
                onChange={onChange}
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas(<FormattedMessage id="aktivitetstavle.avbrutt" />, hengelasAlt)}
                value={statuser.STATUS_AVBRUTT}
                id={`id--${statuser.STATUS_AVBRUTT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_AVBRUTT)}
                disabled={props.disableStatusEndring || lasterData}
            />
        </form>
    );
}

const OppdaterReduxForm = reduxForm({
    form: 'aktivitet-status-form'
})(AktivitetStatusForm);

AktivitetStatusForm.defaultProps = {
    valgtAktivitetStatus: statuser.INGEN_VALGT,
    aktivitetDataStatus: STATUS.NOT_STARTED
};

AktivitetStatusForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired,
    valgtAktivitetStatus: PT.string,
    aktivitet: aktivitetPT.isRequired,
    doFlyttAktivitet: PT.func.isRequired,
    aktivitetDataStatus: PT.string,
    intl: intlShape
};

const mapStateToProps = (state, props) => ({
    aktivitetDataStatus: state.data.aktiviteter.status,
    valgtAktivitetStatus: formValueSelector('aktivitet-status-form')(state, 'aktivitetstatus'),
    initialValues: {
        aktivitetstatus: props.aktivitet.status
    }
});

const mapDispatchToProps = (dispatch) => ({
    doFlyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OppdaterReduxForm));
