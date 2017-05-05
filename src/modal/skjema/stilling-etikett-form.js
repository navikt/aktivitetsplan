import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import * as statuser from '../../constant';
import Radio from './input/radio';
import { oppdaterAktivitet } from '../../ducks/aktiviteter';
import { aktivitet as aktivitetPT } from '../../proptypes';
import { STATUS } from '../../ducks/utils';

function StillingEtikettForm(props) {
    const { aktivitet, oppdaterEtikett, aktiviteterStatus } = props;
    const onChange = (event) => {
        oppdaterEtikett(aktivitet, event.currentTarget.value);
    };
    const erEtikettChecked = (statusId) => props.valgtEtikettStatus === statusId;
    const laster = aktiviteterStatus === STATUS.PENDING;
    return (
        <form className="skjema oppdateretikett-skjema">
            <Radio
                onChange={onChange}
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling-aktivitet.status.ingen" />}
                value={statuser.INGEN_VALGT}
                id={`id--${statuser.INGEN_VALGT}`}
                name="etikettstatus"
                checked={!props.valgtEtikettStatus || erEtikettChecked(statuser.INGEN_VALGT)}
                disabled={props.disableStatusEndring || laster}
            />
            <Radio
                onChange={onChange}
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling-aktivitet.status.soknad-sendt" />}
                value={statuser.SOKNAD_SENDT}
                id={`id--${statuser.SOKNAD_SENDT}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.SOKNAD_SENDT)}
                disabled={props.disableStatusEndring || laster}
            />
            <Radio
                onChange={onChange}
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling-aktivitet.status.innkalt-til-intervju" />}
                value={statuser.INNKALT_TIL_INTERVJU}
                id={`id--${statuser.INNKALT_TIL_INTERVJU}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.INNKALT_TIL_INTERVJU)}
                disabled={props.disableStatusEndring || laster}
            />
            <Radio
                onChange={onChange}
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling-aktivitet.status.avslag" />}
                value={statuser.AVSLAG}
                id={`id--${statuser.AVSLAG}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.AVSLAG)}
                disabled={props.disableStatusEndring || laster}
            />
            <Radio
                onChange={onChange}
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling-aktivitet.status.jobbtilbud" />}
                value={statuser.JOBBTILBUD}
                id={`id--${statuser.JOBBTILBUD}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.JOBBTILBUD)}
                disabled={props.disableStatusEndring || laster}
            />
        </form>
    );
}

const OppdaterReduxForm = reduxForm({
    form: 'etikett-status-form'
})(StillingEtikettForm);

StillingEtikettForm.defaultProps = {
    aktiviteterStatus: 'OK',
    valgtEtikettStatus: statuser.INGEN_VALGT
};

StillingEtikettForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired,
    valgtEtikettStatus: PT.string,
    aktivitet: aktivitetPT.isRequired,
    oppdaterEtikett: PT.func.isRequired,
    aktiviteterStatus: PT.string
};

const mapStateToProps = (state, props) => ({
    aktiviteterStatus: state.data.aktiviteter.status,
    valgtEtikettStatus: formValueSelector('etikett-status-form')(state, 'etikettstatus'),
    initialValues: {
        etikettstatus: props.aktivitet.etikett
    }
});

const mapDispatchToProps = (dispatch) => ({
    oppdaterEtikett: (aktivitet, etikett) => oppdaterAktivitet({ ...aktivitet, etikett })(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterReduxForm);
