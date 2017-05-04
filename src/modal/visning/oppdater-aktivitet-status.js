import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';
import Undertittel from 'nav-frontend-typografi/src/undertittel';
import Bilde from 'nav-react-design/dist/bilde';
import * as statuser from '../../constant';
import { flyttAktivitet } from '../../ducks/aktiviteter';
import Radio from '../skjema/input/radio';
import hengelasSVG from '../../img/hengelas.svg';
import * as AppPT from '../../proptypes';
import { STATUS } from '../../ducks/utils';
import history from '../../history';

const leggTilHengelas = (tekst) => (
    <span>
        {tekst}&nbsp;&nbsp;<Bilde style={{ position: 'absolute' }} src={hengelasSVG} alt="hengelås ikon" />
    </span>
);

function OppdaterAktivitetStatus(props) {
    const { valgtAktivitetStatus, valgtEtikettStatus, doFlyttAktivitet, aktiviteter, paramsId } = props;
    const onLagre = (aktivitet) => {
        if (aktivitet.status === valgtAktivitetStatus) {
            return history.push('/');
        } else if (valgtAktivitetStatus === statuser.STATUS_FULLFOERT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/fullfor`);
        } else if (valgtAktivitetStatus === statuser.STATUS_AVBRUTT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/avbryt`);
        } else {
            doFlyttAktivitet(aktivitet, valgtAktivitetStatus);
            history.push('/');
        }
        return null;
    };
    const erAktivitetChecked = (statusId) => valgtAktivitetStatus === statusId;
    const erEtikettChecked = (statusId) => valgtEtikettStatus === statusId;
    const disableStatusEndring = props.status === statuser.STATUS_AVBRUTT ||
        props.status === statuser.STATUS_FULLFOERT;
    const valgtAktivitet = aktiviteter.data.find((aktivitet) => aktivitet.id === paramsId);
    const erStillingsAktivitet = valgtAktivitet.type === statuser.STILLING_AKTIVITET_TYPE;
    const statusRadioGroup = (
        <div className="oppdaterstatus-skjema">
            <Radio
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.brukerErInteressert" />}
                value={statuser.STATUS_BRUKER_ER_INTRESSERT}
                id={`id--${statuser.STATUS_BRUKER_ER_INTRESSERT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_BRUKER_ER_INTRESSERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.planlagt" />}
                value={statuser.STATUS_PLANLAGT}
                id={`id--${statuser.STATUS_PLANLAGT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_PLANLAGT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={<FormattedMessage id="aktivitetstavle.gjennomfoert" />}
                value={statuser.STATUS_GJENNOMFOERT}
                id={`id--${statuser.STATUS_GJENNOMFOERT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_GJENNOMFOERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas(<FormattedMessage id="aktivitetstavle.fullfoert" />)}
                value={statuser.STATUS_FULLFOERT}
                id={`id--${statuser.STATUS_FULLFOERT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_FULLFOERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas(<FormattedMessage id="aktivitetstavle.avbrutt" />)}
                value={statuser.STATUS_AVBRUTT}
                id={`id--${statuser.STATUS_AVBRUTT}`}
                name="aktivitetstatus"
                checked={erAktivitetChecked(statuser.STATUS_AVBRUTT)}
                disabled={disableStatusEndring}
            />
        </div>
    );
    const etikettRadioGroup = (
        <div className="oppdateretikett-skjema">
            <Radio
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling.aktivitet.status.soknad-sendt" />}
                value={statuser.SOKNAD_SENDT}
                id={`id--${statuser.SOKNAD_SENDT}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.SOKNAD_SENDT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling.aktivitet.status.innkalt-til-intervju" />}
                value={statuser.INNKALT_TIL_INTERVJU}
                id={`id--${statuser.INNKALT_TIL_INTERVJU}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.INNKALT_TIL_INTERVJU)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling.aktivitet.status.avslag" />}
                value={statuser.AVSLAG}
                id={`id--${statuser.AVSLAG}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.AVSLAG)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'etikettstatus'}
                label={<FormattedMessage id="stilling.aktivitet.status.jobbtilbud" />}
                value={statuser.JOBBTILBUD}
                id={`id--${statuser.JOBBTILBUD}`}
                name="etikettstatus"
                checked={erEtikettChecked(statuser.JOBBTILBUD)}
                disabled={disableStatusEndring}
            />
        </div>
    );
    const radioSkjema = (
        <form className="skjema oppdater-statuser-radioform blokk-m">
            {statusRadioGroup}
            {erStillingsAktivitet && etikettRadioGroup}
        </form>
    );

    return (
        <section>
            <Undertittel className="blokk-s">
                Oppdater status
            </Undertittel>
            {radioSkjema}
            {props.dirty &&
                <Knapp
                    spinner={aktiviteter.status !== STATUS.OK}
                    autoDisableVedSpinner
                    onClick={() => onLagre(valgtAktivitet)}
                >
                    Lagre
                </Knapp>
            }
        </section>
    );
}

const OppdaterReduxForm = reduxForm({
    form: 'oppdater-form'
})(OppdaterAktivitetStatus);

OppdaterAktivitetStatus.propTypes = {
    status: PT.string.isRequired,
    valgtAktivitetStatus: PT.string,
    valgtEtikettStatus: PT.string,
    doFlyttAktivitet: PT.func.isRequired,
    paramsId: PT.string.isRequired,
    aktiviteter: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.aktivitet)
    }),
    dirty: PT.bool.isRequired
};

const mapStateToProps = (state, props) => ({
    aktiviteter: state.data.aktiviteter,
    valgtAktivitetStatus: formValueSelector('oppdater-form')(state, 'aktivitetstatus'),
    valgtEtikettStatus: formValueSelector('oppdater-form')(state, 'etikettstatus'),
    initialValues: {
        aktivitetstatus: props.status
    }
});

const mapDispatchToProps = (dispatch) => ({
    doFlyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterReduxForm);
