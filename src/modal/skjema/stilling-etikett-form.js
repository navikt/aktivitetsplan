import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import * as statuser from '../../constant';
import Radio from './input/radio';
import { oppdaterAktivitet } from '../../ducks/aktiviteter';
import { aktivitet as aktivitetPT } from '../../proptypes';

function StillingEtikettForm(props) {
    const { aktivitet } = props;
    const onChange = () => {
        return null;
    };
    const erEtikettChecked = (statusId) => props.valgtEtikettStatus === statusId;
    return (
        <form className="skjema oppdateretikett-skjema" onChange={onChange}>
            <Radio
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling.aktivitet.status.soknad-sendt" />}
                value={statuser.SOKNAD_SENDT}
                id={`id--${statuser.SOKNAD_SENDT}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.SOKNAD_SENDT)}
                disabled={props.disableStatusEndring}
            />
            <Radio
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling.aktivitet.status.innkalt-til-intervju" />}
                value={statuser.INNKALT_TIL_INTERVJU}
                id={`id--${statuser.INNKALT_TIL_INTERVJU}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.INNKALT_TIL_INTERVJU)}
                disabled={props.disableStatusEndring}
            />
            <Radio
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling.aktivitet.status.avslag" />}
                value={statuser.AVSLAG}
                id={`id--${statuser.AVSLAG}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.AVSLAG)}
                disabled={props.disableStatusEndring}
            />
            <Radio
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling.aktivitet.status.jobbtilbud" />}
                value={statuser.JOBBTILBUD}
                id={`id--${statuser.JOBBTILBUD}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.JOBBTILBUD)}
                disabled={props.disableStatusEndring}
            />
        </form>
    );
}

const OppdaterReduxForm = reduxForm({
    form: 'etikett-status-form'
})(StillingEtikettForm);

StillingEtikettForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired,
    valgtEtikettStatus: PT.string.isRequired,
    aktivitet: aktivitetPT.isRequired
};

const mapStateToProps = (state, props) => ({
    oppdaterEtikett: PT.func.isRequired,
    valgtEtikettStatus: formValueSelector('etikett-status-form')(state, 'etikettstatus'),
    initialValues: {
        etikettstatus: props.status
    }
});

const mapDispatchToProps = (dispatch) => ({
    oppdaterEtikett: (aktivitet, etikett) => oppdaterAktivitet({ ...aktivitet, etikett })(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterReduxForm);
