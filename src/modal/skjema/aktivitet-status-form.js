import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Bilde from 'nav-react-design/dist/bilde';
import { rules, validForm } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import * as statuser from '../../constant';
import Radio from './input/radio';
import hengelasSVG from '../../img/hengelas.svg';
import { flyttAktivitetMedBegrunnelse } from '../../ducks/aktiviteter';
import { aktivitet as aktivitetPT } from '../../proptypes';
import { STATUS } from '../../ducks/utils';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import visibleIf from '../../hocs/visible-if';
import Textarea from '../skjema/textarea/textarea';

const leggTilHengelas = (tekst, altTekst) =>
    <span>
        {tekst}
        &nbsp;&nbsp;
        <Bilde
            style={{ position: 'absolute' }}
            src={hengelasSVG}
            alt={altTekst}
        />
    </span>;

const AKTIVITET_STATUS_FORM_NAME = 'aktivitet-status-form';
const MAKS_LENGDE = 255;

const VisibleAlertStripeSuksessSolid = visibleIf(AlertStripeInfoSolid);

function AktivitetStatusForm(props) {
    const { aktivitet, dirty, handleSubmit, aktivitetDataStatus } = props;
    const lasterData = aktivitetDataStatus !== STATUS.OK;
    const hengelasAlt = props.intl.formatMessage({ id: 'hengelas-icon-alt' });

    const visAdvarsel =
        props.valgtAktivitetStatus === statuser.STATUS_FULLFOERT ||
        props.valgtAktivitetStatus === statuser.STATUS_AVBRUTT;

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col col-xs-6">
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={
                            <FormattedMessage id="aktivitetstavle.brukerErInteressert" />
                        }
                        value={statuser.STATUS_BRUKER_ER_INTRESSERT}
                        id={`id--${statuser.STATUS_BRUKER_ER_INTRESSERT}`}
                        disabled={props.disableStatusEndring || lasterData}
                    />
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={
                            <FormattedMessage id="aktivitetstavle.planlagt" />
                        }
                        value={statuser.STATUS_PLANLAGT}
                        id={`id--${statuser.STATUS_PLANLAGT}`}
                        disabled={props.disableStatusEndring || lasterData}
                    />
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={
                            <FormattedMessage id="aktivitetstavle.gjennomfoert" />
                        }
                        value={statuser.STATUS_GJENNOMFOERT}
                        id={`id--${statuser.STATUS_GJENNOMFOERT}`}
                        disabled={props.disableStatusEndring || lasterData}
                    />
                </div>
                <div className="col col-xs-6">
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={leggTilHengelas(
                            <FormattedMessage id="aktivitetstavle.fullfoert" />,
                            hengelasAlt
                        )}
                        value={statuser.STATUS_FULLFOERT}
                        id={`id--${statuser.STATUS_FULLFOERT}`}
                        disabled={props.disableStatusEndring || lasterData}
                    />
                    <Radio
                        feltNavn="aktivitetstatus"
                        label={leggTilHengelas(
                            <FormattedMessage id="aktivitetstavle.avbrutt" />,
                            hengelasAlt
                        )}
                        value={statuser.STATUS_AVBRUTT}
                        id={`id--${statuser.STATUS_AVBRUTT}`}
                        disabled={props.disableStatusEndring || lasterData}
                    />
                </div>
            </div>
            <VisibleIfDiv className="row" visible={dirty}>
                <VisibleAlertStripeSuksessSolid visible={visAdvarsel}>
                    <FormattedMessage id="aktivitetstatus.oppdater-status-advarsel" />
                </VisibleAlertStripeSuksessSolid>

                <VisibleIfDiv visible={aktivitet.avtalt && visAdvarsel}>
                    <Textarea
                        labelId={
                            <FormattedMessage id="aktivitetstatus.oppdater-status-begrunnelse" />
                        }
                        feltNavn="begrunnelse"
                        name="begrunnelse-aktivitet"
                        maxLength={MAKS_LENGDE}
                        disabled={lasterData}
                    />
                </VisibleIfDiv>

                <Hovedknapp
                    spinner={lasterData}
                    mini
                    autoDisableVedSpinner
                    className="knapp--mini oppdater-status"
                >
                    <FormattedMessage id="aktivitetstatus.bekreft-knapp" />
                </Hovedknapp>
            </VisibleIfDiv>
        </form>
    );
}

const forLang = rules.maxLength(
    MAKS_LENGDE,
    <FormattedMessage
        id="opprett-begrunnelse.melding.feilmelding.for-lang"
        values={{ MAKS_LENGDE }}
    />
);

const pakrevd = rules.minLength(
    0,
    <FormattedMessage id="opprett-begrunnelse.melding.feilmelding.for-kort" />
);

const OppdaterReduxForm = validForm({
    form: AKTIVITET_STATUS_FORM_NAME,
    validate: {
        begrunnelse: [forLang, pakrevd],
    },
})(AktivitetStatusForm);

AktivitetStatusForm.defaultProps = {
    valgtAktivitetStatus: statuser.INGEN_VALGT,
    aktivitetDataStatus: STATUS.NOT_STARTED,
};

AktivitetStatusForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired,
    handleSubmit: PT.func,
    dirty: PT.bool,
    valgtAktivitetStatus: PT.string,
    aktivitet: aktivitetPT.isRequired,
    aktivitetDataStatus: PT.string,
    intl: intlShape,
};

const mapStateToProps = (state, props) => ({
    aktivitetDataStatus: state.data.aktiviteter.status,
    valgtAktivitetStatus: formValueSelector(AKTIVITET_STATUS_FORM_NAME)(
        state,
        'aktivitetstatus'
    ),
    initialValues: {
        begrunnelse: props.aktivitet.avsluttetKommentar,
        aktivitetstatus: props.aktivitet.status,
    },
});

const mapDispatchToProps = () => ({
    onSubmit: (values, dispatch, props) => {
        dispatch(
            flyttAktivitetMedBegrunnelse(
                props.aktivitet,
                values.aktivitetstatus,
                values.begrunnelse
            )
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(OppdaterReduxForm)
);
