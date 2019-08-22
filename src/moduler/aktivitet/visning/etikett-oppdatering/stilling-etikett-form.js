import React, { useContext, useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import * as konstanter from '../../../../constant';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import { STATUS } from '../../../../ducks/utils';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import Radio from '../../../../felles-komponenter/skjema/input-v2/radio';
import * as AppPT from '../../../../proptypes';
import { DirtyContext } from '../../../context/dirty-context';

export const STILLING_ETIKETT_FORM_NAME = 'stilling-etikett-form';

const validator = useFormstate({
    etikettstatus: () => {},
});

function StillingEtikettForm(props) {
    const { aktivitet, disabled, onSubmit } = props;

    const state = validator({
        etikettstatus: aktivitet.etikett || konstanter.INGEN_VALGT,
    });

    const dirty = useContext(DirtyContext);
    useEffect(() => dirty.setFormIsDirty('etikett', !state.pristine), [
        dirty.setFormIsDirty,
        state.pristine,
    ]); //eslint-disable-line

    return (
        <form
            onSubmit={state.onSubmit(data => {
                state.reinitialize(data);
                return onSubmit(data);
            })}
        >
            <div className="row">
                <div className="col col-xs-4">
                    <Radio
                        label="Ingen"
                        value={konstanter.INGEN_VALGT}
                        disabled={disabled}
                        {...state.fields.etikettstatus}
                    />
                    <Radio
                        label="Søknaden er sendt"
                        value={konstanter.SOKNAD_SENDT}
                        disabled={disabled}
                        {...state.fields.etikettstatus}
                    />
                </div>
                <div className="col col-xs-4">
                    <Radio
                        label="Innkalt til intervju"
                        value={konstanter.INNKALT_TIL_INTERVJU}
                        disabled={disabled}
                        {...state.fields.etikettstatus}
                    />
                    <Radio
                        label="Fått avslag"
                        value={konstanter.AVSLAG}
                        disabled={disabled}
                        {...state.fields.etikettstatus}
                    />
                </div>
                <div className="col col-xs-4">
                    <Radio
                        label="Fått jobbtilbud"
                        value={konstanter.JOBBTILBUD}
                        disabled={disabled}
                        {...state.fields.etikettstatus}
                    />
                </div>
            </div>
            <VisibleIfDiv visible={!state.pristine}>
                <Hovedknapp className="oppdater-status" disabled={disabled}>
                    <FormattedMessage id="aktivitetstatus.bekreft-knapp" />
                </Hovedknapp>
            </VisibleIfDiv>
        </form>
    );
}

StillingEtikettForm.defaultProps = {
    aktivitetDataStatus: STATUS.NOT_STARTED,
};

StillingEtikettForm.propTypes = {
    aktivitetDataStatus: PT.string,
    aktivitet: AppPT.aktivitet.isRequired,
    disableStatusEndring: PT.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
    disabled: PT.bool.isRequired,
    onSubmit: PT.func.isRequired,
};

const mapStateToProps = (state, props) => {
    const aktivitetDataStatus = selectAktivitetStatus(state);
    return {
        aktivitetDataStatus,
        disabled:
            aktivitetDataStatus !== STATUS.OK || props.disableStatusEndring,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: values => {
        const nyEtikett =
            values.etikettstatus === konstanter.INGEN_VALGT
                ? null
                : values.etikettstatus;
        return dispatch(
            oppdaterAktivitetEtikett({ ...props.aktivitet, etikett: nyEtikett })
        ).then(() => document.querySelector('.aktivitet-modal').focus());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    StillingEtikettForm
);
