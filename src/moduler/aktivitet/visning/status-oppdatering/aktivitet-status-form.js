import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, untouch } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import FieldGroupsValidering from '../../../../felles-komponenter/skjema/fieldgroups-validering';
import { flyttAktivitetMedBegrunnelse } from '../../aktivitet-actions';
import { aktivitet as aktivitetPT } from '../../../../proptypes';
import { STATUS } from '../../../../ducks/utils';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import visibleIf from '../../../../hocs/visible-if';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import {
    manglerPubliseringAvSamtaleReferat,
    trengerBegrunnelse,
} from '../../aktivitet-util';
import {
    GRUPPE_AKTIVITET_TYPE,
    INGEN_VALGT,
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../../constant';
import StatusRadio from './status-radio';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import { selectArenaAktivitetStatus } from '../../arena-aktivitet-selector';
import { flyttetAktivitetMetrikk } from '../../../../felles-komponenter/utils/logging';

export const AKTIVITET_STATUS_FORM_NAME = 'aktivitet-status-form';
const BEGRUNNELSE_FELT_NAME = 'begrunnelse';
const MAKS_LENGDE = 255;

const VisibleAlertStripeSuksessSolid = visibleIf(AlertStripeInfoSolid);

function statusKreverInformasjonMelding(status) {
    return status === STATUS_FULLFOERT || status === STATUS_AVBRUTT;
}

function kanOppdatereStatus(props) {
    const ferdigStatus = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(
        props.valgtAktivitetStatus
    );
    const ferdigOgManglerPubliseringAvSamtaleReferat =
        ferdigStatus &&
        manglerPubliseringAvSamtaleReferat(
            props.aktivitet || {},
            props.valgtAktivitetStatus
        );

    return !ferdigOgManglerPubliseringAvSamtaleReferat;
}

function AktivitetStatusForm(props) {
    const {
        aktivitet,
        dirty,
        handleSubmit,
        aktivitetDataStatus,
        valgtAktivitetStatus,
        disableStatusEndring,
        errorSummary,
    } = props;
    const lasterData = aktivitetDataStatus !== STATUS.OK;
    const visAdvarsel = statusKreverInformasjonMelding(valgtAktivitetStatus);
    const visBegrunnelseFelt = trengerBegrunnelse(
        aktivitet.avtalt,
        valgtAktivitetStatus,
        aktivitet.type
    );
    const disabled = disableStatusEndring || lasterData;

    return (
        <form onSubmit={handleSubmit}>
            {errorSummary}
            <FieldGroupsValidering
                feltNavn="statusValidering"
                errorMessageId="referat.validering.ikke-publisert"
                validate={() => kanOppdatereStatus(props)}
            >
                <div className="row">
                    <div className="col col-xs-4">
                        <StatusRadio
                            status={STATUS_BRUKER_ER_INTRESSERT}
                            disabled={disabled}
                        />
                        <StatusRadio
                            status={STATUS_PLANLAGT}
                            disabled={disabled}
                        />
                    </div>
                    <div className="col col-xs-4">
                        <StatusRadio
                            status={STATUS_GJENNOMFOERT}
                            disabled={disabled}
                        />
                        <StatusRadio
                            status={STATUS_FULLFOERT}
                            disabled={disabled}
                        />
                    </div>
                    <div className="col col-xs-4">
                        <StatusRadio
                            status={STATUS_AVBRUTT}
                            disabled={disabled}
                        />
                    </div>
                </div>
            </FieldGroupsValidering>

            <VisibleIfDiv className="status-alert" visible={dirty}>
                <VisibleAlertStripeSuksessSolid
                    visible={visAdvarsel}
                    role="alert"
                >
                    <FormattedMessage id="aktivitetstatus.oppdater-status-advarsel" />
                </VisibleAlertStripeSuksessSolid>

                <VisibleIfDiv visible={visBegrunnelseFelt}>
                    <Textarea
                        labelId={
                            <FormattedMessage
                                id="aktivitetstatus.oppdater-status-begrunnelse"
                                values={{ valgtAktivitetStatus }}
                            />
                        }
                        feltNavn={BEGRUNNELSE_FELT_NAME}
                        name="begrunnelse-aktivitet"
                        maxLength={MAKS_LENGDE}
                        disabled={lasterData}
                    />
                </VisibleIfDiv>

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

const ikkeForLangBegrunnelse = maksLengde(
    'opprett-begrunnelse.melding.feilmelding.for-lang',
    MAKS_LENGDE
);
const harBegrunnelse = pakrevd(
    'opprett-begrunnelse.melding.feilmelding.for-kort'
);

const harBegrunnelseHvisAvtaltOgPakrevdForStatus = (begrunnelse, props) =>
    trengerBegrunnelse(
        props.aktivitet.avtalt,
        props.values.aktivitetstatus,
        props.aktivitet.type
    ) && harBegrunnelse(begrunnelse, props);

const OppdaterReduxForm = validForm({
    form: AKTIVITET_STATUS_FORM_NAME,
    enableReinitialize: true,
    errorSummaryTitle: (
        <FormattedMessage id="aktivitetstatus.form.feiloppsummering-tittel" />
    ),
    validate: {
        begrunnelse: [
            ikkeForLangBegrunnelse,
            harBegrunnelseHvisAvtaltOgPakrevdForStatus,
        ],
        statusValidering: [],
    },
})(AktivitetStatusForm);

AktivitetStatusForm.defaultProps = {
    valgtAktivitetStatus: INGEN_VALGT,
    aktivitetDataStatus: STATUS.NOT_STARTED,
};

AktivitetStatusForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired,
    handleSubmit: PT.func.isRequired,
    dirty: PT.bool.isRequired,
    valgtAktivitetStatus: PT.string,
    aktivitet: aktivitetPT.isRequired,
    aktivitetDataStatus: PT.string,
    errorSummary: PT.node.isRequired,
};

const mapStateToProps = (state, props) => {
    const { aktivitet } = props;
    const { status, avsluttetKommentar, type } = aktivitet;
    const erArenaAktivitet = [
        TILTAK_AKTIVITET_TYPE,
        GRUPPE_AKTIVITET_TYPE,
        UTDANNING_AKTIVITET_TYPE,
    ].includes(type);
    const aktivitetDataStatus = erArenaAktivitet
        ? selectArenaAktivitetStatus(state)
        : selectAktivitetStatus(state);
    return {
        aktivitetDataStatus,
        valgtAktivitetStatus: formValueSelector(AKTIVITET_STATUS_FORM_NAME)(
            state,
            'aktivitetstatus'
        ),
        initialValues: {
            begrunnelse: avsluttetKommentar,
            aktivitetstatus: status,
        },
    };
};

const mapDispatchToProps = () => ({
    onSubmit: (values, dispatch, props) => {
        dispatch(
            flyttAktivitetMedBegrunnelse(
                props.aktivitet,
                values.aktivitetstatus,
                values.begrunnelse
            )
        ).then(() => {
            document.querySelector('.aktivitet-modal').focus();
            dispatch(
                untouch(AKTIVITET_STATUS_FORM_NAME, BEGRUNNELSE_FELT_NAME)
            );
        });
        flyttetAktivitetMetrikk(
            'submit',
            props.aktivitet,
            values.aktivitetstatus
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterReduxForm);
