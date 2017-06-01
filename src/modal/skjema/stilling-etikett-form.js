import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import * as statuser from '../../constant';
import Radio from './input/radio';
import { oppdaterAktivitetEtikett } from '../../ducks/aktiviteter';
import { aktivitet as aktivitetPT } from '../../proptypes';
import { STATUS } from '../../ducks/utils';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function StillingEtikettForm(props) {
    const { aktivitet, oppdaterEtikett, dirty, handleSubmit, disabled } = props;
    const onChange = values => {
        oppdaterEtikett(aktivitet, values.etikettstatus);
    };
    const erEtikettChecked = statusId => props.valgtEtikettStatus === statusId;

    return (
        <form onSubmit={handleSubmit(onChange)}>
            <div className="row">
                <div className="col col-xs-6">
                    <Radio
                        feltNavn={'etikettstatus'}
                        label={<FormattedMessage id="etikett.INGEN_VALGT" />}
                        value={statuser.INGEN_VALGT}
                        id={`id--${statuser.INGEN_VALGT}`}
                        name="etikettstatus"
                        checked={
                            !props.valgtEtikettStatus ||
                                erEtikettChecked(statuser.INGEN_VALGT)
                        }
                        disabled={disabled}
                    />
                    <Radio
                        feltNavn={'etikettstatus'}
                        label={<FormattedMessage id="etikett.SOKNAD_SENDT" />}
                        value={statuser.SOKNAD_SENDT}
                        id={`id--${statuser.SOKNAD_SENDT}`}
                        name="etikettstatus"
                        checked={erEtikettChecked(statuser.SOKNAD_SENDT)}
                        disabled={disabled}
                    />
                    <Radio
                        feltNavn={'etikettstatus'}
                        label={
                            <FormattedMessage id="etikett.INNKALT_TIL_INTERVJU" />
                        }
                        value={statuser.INNKALT_TIL_INTERVJU}
                        id={`id--${statuser.INNKALT_TIL_INTERVJU}`}
                        name="etikettstatus"
                        checked={erEtikettChecked(
                            statuser.INNKALT_TIL_INTERVJU
                        )}
                        disabled={disabled}
                    />
                </div>
                <div className="col col-xs-6">
                    <Radio
                        feltNavn={'etikettstatus'}
                        label={<FormattedMessage id="etikett.AVSLAG" />}
                        value={statuser.AVSLAG}
                        id={`id--${statuser.AVSLAG}`}
                        name="etikettstatus"
                        checked={erEtikettChecked(statuser.AVSLAG)}
                        disabled={disabled}
                    />
                    <Radio
                        feltNavn={'etikettstatus'}
                        label={<FormattedMessage id="etikett.JOBBTILBUD" />}
                        value={statuser.JOBBTILBUD}
                        id={`id--${statuser.JOBBTILBUD}`}
                        name="etikettstatus"
                        checked={erEtikettChecked(statuser.JOBBTILBUD)}
                        disabled={disabled}
                    />
                </div>
            </div>
            <VisibleIfDiv className="row" visible={dirty}>
                <Hovedknapp mini>
                    <FormattedMessage id="etikettstatus.bekreft-knapp" />
                </Hovedknapp>
            </VisibleIfDiv>
        </form>
    );
}

const OppdaterReduxForm = reduxForm({
    form: 'etikett-status-form',
})(StillingEtikettForm);

StillingEtikettForm.defaultProps = {
    aktiviteterStatus: 'OK',
    valgtEtikettStatus: null,
};

StillingEtikettForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
    valgtEtikettStatus: PT.string,
    handleSubmit: PT.func.isRequired,
    dirty: PT.bool.isRequired,
    aktivitet: aktivitetPT.isRequired,
    oppdaterEtikett: PT.func.isRequired,
    disabled: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
    disabled: state.data.aktiviteter.status !== STATUS.OK ||
        props.disableStatusEndring,
    valgtEtikettStatus: formValueSelector('etikett-status-form')(
        state,
        'etikettstatus'
    ),
    initialValues: {
        etikettstatus: props.aktivitet.etikett,
    },
});

const mapDispatchToProps = dispatch => ({
    oppdaterEtikett: (aktivitet, etikett) => {
        const nyEtikett = etikett === statuser.INGEN_VALGT ? null : etikett;
        oppdaterAktivitetEtikett({ ...aktivitet, etikett: nyEtikett })(
            dispatch
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterReduxForm);
