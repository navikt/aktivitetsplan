import React, { useContext, useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import useFormstate from '@nutgaard/use-formstate';
import { flyttAktivitetMedBegrunnelse } from '../../aktivitet-actions';
import { aktivitet as aktivitetPT } from '../../../../proptypes';
import { STATUS } from '../../../../ducks/utils';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import visibleIf from '../../../../hocs/visible-if';
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
import { selectAktivitetStatus } from '../../aktivitet-selector';
import { selectArenaAktivitetStatus } from '../../arena-aktivitet-selector';
import { flyttetAktivitetMetrikk } from '../../../../felles-komponenter/utils/logging';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import FieldGroup from '../../../../felles-komponenter/skjema/field-group/fieldgroups-valideringv2';
import Radio from '../../../../felles-komponenter/skjema/input-v2/radio';
import Textarea from '../../../../felles-komponenter/skjema/input-v2/textarea';
import { DirtyContext } from '../../../context/dirty-context';

const VisibleAlertStripeSuksessSolid = visibleIf(AlertStripeInfoSolid);

function statusKreverInformasjonMelding(status) {
    return status === STATUS_FULLFOERT || status === STATUS_AVBRUTT;
}

function label(status) {
    if (status === STATUS_FULLFOERT) {
        return 'Skriv en kort kommentar om hvordan det har gått med aktiviteten, eller noe NAV bør kjenne til.';
    }
    return 'Skriv en kort begrunnelse om hvorfor du avbrøt aktiviteten. Etter at du har trykket på "Bekreft", må du gi beskjed til veilederen din ved å starte en dialog her i aktivitetsplanen.';
}

function kanOppdatereStatus(aktivitet, values) {
    const status = values.aktivitetstatus;
    const ferdigStatus = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const ferdigOgManglerPubliseringAvSamtaleReferat =
        ferdigStatus &&
        manglerPubliseringAvSamtaleReferat(aktivitet || {}, status);

    if (ferdigOgManglerPubliseringAvSamtaleReferat) {
        return 'Samtalereferatet må deles før du kan sette aktiviteten til denne statusen';
    }

    return null;
}

function validateBegrunnelse(value, values, aktivitet) {
    const status = values.aktivitetstatus;
    if (
        trengerBegrunnelse(aktivitet.avtalt, status, aktivitet.type) &&
        value.trim().length === 0
    ) {
        return 'Du må fylle ut en begrunnelse';
    }
    if (value.length > 255) {
        return 'Du må korte ned teksten til 255 tegn';
    }
    return null;
}

function AktivitetStatusForm(props) {
    const {
        aktivitet,
        onSubmit,
        aktivitetDataStatus,
        disableStatusEndring,
    } = props;

    const validator = useFormstate({
        aktivitetstatus: () => {},
        begrunnelse: (val, values) =>
            validateBegrunnelse(val, values, aktivitet),
        statusValidering: (val, values) =>
            kanOppdatereStatus(aktivitet, values),
    });

    const state = validator({
        aktivitetstatus: aktivitet.status || '',
        begrunnelse: aktivitet.avsluttetBegrunnelse || '',
        statusValidering: '',
    });

    const dirty = useContext(DirtyContext);
    useEffect(() => dirty.setFormIsDirty('status', !state.pristine), [
        dirty.setFormIsDirty,
        state.pristine,
    ]); //eslint-disable-line

    const status = state.fields.aktivitetstatus.input.value;
    const lasterData = aktivitetDataStatus !== STATUS.OK;
    const visAdvarsel = statusKreverInformasjonMelding(status);
    const visBegrunnelseFelt = trengerBegrunnelse(
        aktivitet.avtalt,
        status,
        aktivitet.type
    );

    const disabled = disableStatusEndring || lasterData;

    return (
        <form
            onSubmit={state.onSubmit(data => {
                state.reinitialize(data);
                return onSubmit(data);
            })}
        >
            <FormErrorSummary
                errors={state.errors}
                submittoken={state.submittoken}
            />
            <FieldGroup
                name="statusValidering"
                alwaysValidate
                field={state.fields.statusValidering}
            >
                <div className="row">
                    <div className="col col-xs-4">
                        <Radio
                            label="Forslag"
                            value={STATUS_BRUKER_ER_INTRESSERT}
                            disabled={disabled}
                            {...state.fields.aktivitetstatus}
                        />
                        <Radio
                            label="Planlegger"
                            value={STATUS_PLANLAGT}
                            disabled={disabled}
                            {...state.fields.aktivitetstatus}
                        />
                    </div>
                    <div className="col col-xs-4">
                        <Radio
                            label="Gjennomfører"
                            value={STATUS_GJENNOMFOERT}
                            disabled={disabled}
                            {...state.fields.aktivitetstatus}
                        />
                        <Radio
                            label="Fullført"
                            value={STATUS_FULLFOERT}
                            disabled={disabled}
                            {...state.fields.aktivitetstatus}
                        />
                    </div>
                    <div className="col col-xs-4">
                        <Radio
                            label="Avbrutt"
                            value={STATUS_AVBRUTT}
                            disabled={disabled}
                            {...state.fields.aktivitetstatus}
                        />
                    </div>
                </div>
            </FieldGroup>

            <VisibleIfDiv className="status-alert" visible={!state.pristine}>
                <VisibleAlertStripeSuksessSolid
                    visible={visAdvarsel}
                    role="alert"
                >
                    {
                        'Hvis du endrer til "Fullført" eller "Avbrutt", blir aktiviteten låst og du kan ikke lenger endre innholdet.'
                    }
                </VisibleAlertStripeSuksessSolid>

                <VisibleIfDiv visible={visBegrunnelseFelt}>
                    <Textarea
                        label={label(status)}
                        maxLength={255}
                        disabled={lasterData}
                        {...state.fields.begrunnelse}
                    />
                </VisibleIfDiv>

                <Hovedknapp
                    spinner={lasterData}
                    autoDisableVedSpinner
                    className="oppdater-status"
                    disabled={disabled}
                >
                    Bekreft
                </Hovedknapp>
            </VisibleIfDiv>
        </form>
    );
}

AktivitetStatusForm.defaultProps = {
    valgtAktivitetStatus: INGEN_VALGT,
    aktivitetDataStatus: STATUS.NOT_STARTED,
};

AktivitetStatusForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired,
    onSubmit: PT.func.isRequired,
    valgtAktivitetStatus: PT.string,
    aktivitet: aktivitetPT.isRequired,
    aktivitetDataStatus: PT.string,
};

const mapStateToProps = (state, props) => {
    const erArenaAktivitet = [
        TILTAK_AKTIVITET_TYPE,
        GRUPPE_AKTIVITET_TYPE,
        UTDANNING_AKTIVITET_TYPE,
    ].includes(props.aktivitet.type);
    const aktivitetDataStatus = erArenaAktivitet
        ? selectArenaAktivitetStatus(state)
        : selectAktivitetStatus(state);
    return {
        aktivitetDataStatus,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: values => {
        flyttetAktivitetMetrikk(
            'submit',
            props.aktivitet,
            values.aktivitetstatus
        );
        return dispatch(
            flyttAktivitetMedBegrunnelse(
                props.aktivitet,
                values.aktivitetstatus,
                values.begrunnelse
            )
        ).then(() => {
            document.querySelector('.aktivitet-modal').focus();
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    AktivitetStatusForm
);
