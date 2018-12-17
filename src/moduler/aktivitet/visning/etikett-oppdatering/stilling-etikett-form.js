import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { formValueSelector, reduxForm } from 'redux-form';
import * as konstanter from '../../../../constant';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import { STATUS } from '../../../../ducks/utils';
import Radio from '../../../../felles-komponenter/skjema/input/radio';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { selectAktivitetStatus } from '../../aktivitet-selector';

export const STILLING_ETIKETT_FORM_NAME = 'stilling-etikett-form';

function StillingEtikettForm(props) {
    const { aktivitetDataStatus, disabled, dirty, handleSubmit } = props;
    const lasterData = aktivitetDataStatus !== STATUS.OK;

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col col-xs-4">
                    <Radio
                        feltNavn="etikettstatus"
                        label={<FormattedMessage id="etikett.INGEN_VALGT" />}
                        value={konstanter.INGEN_VALGT}
                        id={`id--${konstanter.INGEN_VALGT}`}
                        disabled={disabled}
                    />
                    <Radio
                        feltNavn="etikettstatus"
                        label={<FormattedMessage id="etikett.SOKNAD_SENDT" />}
                        value={konstanter.SOKNAD_SENDT}
                        id={`id--${konstanter.SOKNAD_SENDT}`}
                        disabled={disabled}
                    />
                </div>
                <div className="col col-xs-4">
                    <Radio
                        feltNavn="etikettstatus"
                        label={
                            <FormattedMessage id="etikett.INNKALT_TIL_INTERVJU" />
                        }
                        value={konstanter.INNKALT_TIL_INTERVJU}
                        id={`id--${konstanter.INNKALT_TIL_INTERVJU}`}
                        disabled={disabled}
                    />
                    <Radio
                        feltNavn="etikettstatus"
                        label={<FormattedMessage id="etikett.AVSLAG" />}
                        value={konstanter.AVSLAG}
                        id={`id--${konstanter.AVSLAG}`}
                        disabled={disabled}
                    />
                </div>
                <div className="col col-xs-4">
                    <Radio
                        feltNavn="etikettstatus"
                        label={<FormattedMessage id="etikett.JOBBTILBUD" />}
                        value={konstanter.JOBBTILBUD}
                        id={`id--${konstanter.JOBBTILBUD}`}
                        disabled={disabled}
                    />
                </div>
            </div>
            <VisibleIfDiv visible={dirty}>
                <Hovedknapp
                    spinner={lasterData}
                    autoDisableVedSpinner
                    className="oppdater-status"
                    disabled={disabled}
                >
                    <FormattedMessage id="aktivitetstatus.bekreft-knapp" />
                </Hovedknapp>
            </VisibleIfDiv>
        </form>
    );
}

const StillingEtikettReduxForm = reduxForm({
    form: STILLING_ETIKETT_FORM_NAME,
})(StillingEtikettForm);

StillingEtikettForm.defaultProps = {
    aktivitetDataStatus: STATUS.NOT_STARTED,
};

StillingEtikettForm.propTypes = {
    aktivitetDataStatus: PT.string,
    disableStatusEndring: PT.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
    disabled: PT.bool.isRequired,
    dirty: PT.bool.isRequired,
    handleSubmit: PT.func.isRequired,
};

const mapStateToProps = (state, props) => {
    const aktivitetDataStatus = selectAktivitetStatus(state);
    return {
        aktivitetDataStatus,
        disabled:
            aktivitetDataStatus !== STATUS.OK || props.disableStatusEndring,
        valgtEtikettStatus: formValueSelector(STILLING_ETIKETT_FORM_NAME)(
            state,
            'etikettstatus'
        ),
        initialValues: {
            etikettstatus: props.aktivitet.etikett || konstanter.INGEN_VALGT,
        },
    };
};

const mapDispatchToProps = () => ({
    onSubmit: (values, dispatch, props) => {
        const nyEtikett =
            values.etikettstatus === konstanter.INGEN_VALGT
                ? null
                : values.etikettstatus;
        dispatch(
            oppdaterAktivitetEtikett({ ...props.aktivitet, etikett: nyEtikett })
        ).then(() => document.querySelector('.aktivitet-modal').focus());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    StillingEtikettReduxForm
);
