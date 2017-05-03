import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { Knapp } from 'nav-frontend-knapper';
import Undertittel from 'nav-frontend-typografi/src/undertittel';
import Bilde from 'nav-react-design/dist/bilde';
import * as aktivitetstatus from '../../constant';
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
    const { valgtStatus, doFlyttAktivitet, aktiviteter, paramsId } = props;
    const onLagre = (aktivitet) => {
        if (aktivitet.status === valgtStatus) {
            return history.push('/');
        } else if (valgtStatus === aktivitetstatus.STATUS_FULLFOERT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/fullfor`);
        } else if (valgtStatus === aktivitetstatus.STATUS_AVBRUTT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/avbryt`);
        } else {
            doFlyttAktivitet(aktivitet, valgtStatus);
            history.push('/');
        }
        return null;
    };
    const erChecked = (statusId) => valgtStatus === statusId;
    const disableStatusEndring = props.status === aktivitetstatus.STATUS_AVBRUTT ||
        props.status === aktivitetstatus.STATUS_FULLFOERT;
    const valgtAktivitet = aktiviteter.data.find((aktivitet) => aktivitet.id === paramsId);

    const radioSkjema = (
        <form className="skjema blokk-m">
            <Radio
                feltNavn={'aktivitetstatus'}
                label="Foreslått"
                value={aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT}
                id={`id--${aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label="Planlagt"
                value={aktivitetstatus.STATUS_PLANLAGT}
                id={`id--${aktivitetstatus.STATUS_PLANLAGT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_PLANLAGT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label="Gjennomføres"
                value={aktivitetstatus.STATUS_GJENNOMFOERT}
                id={`id--${aktivitetstatus.STATUS_GJENNOMFOERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_GJENNOMFOERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas('Fullført')}
                value={aktivitetstatus.STATUS_FULLFOERT}
                id={`id--${aktivitetstatus.STATUS_FULLFOERT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_FULLFOERT)}
                disabled={disableStatusEndring}
            />
            <Radio
                feltNavn={'aktivitetstatus'}
                label={leggTilHengelas('Avbrutt')}
                value={aktivitetstatus.STATUS_AVBRUTT}
                id={`id--${aktivitetstatus.STATUS_AVBRUTT}`}
                name="aktivitetstatus"
                checked={erChecked(aktivitetstatus.STATUS_AVBRUTT)}
                disabled={disableStatusEndring}
            />
        </form>
    );

    return (
        <section >
            <Undertittel className="blokk-s">
                Oppdater status
            </Undertittel>
            <div className="oppdaterstatus-skjema">
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
            </div>
        </section>
    );
}

const OppdaterStatusReduxForm = reduxForm({
    form: 'oppdaterStatus-form'
})(OppdaterAktivitetStatus);

OppdaterAktivitetStatus.propTypes = {
    status: PT.string.isRequired,
    valgtStatus: PT.string,
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
    valgtStatus: formValueSelector('oppdaterStatus-form')(state, 'aktivitetstatus'),
    initialValues: {
        aktivitetstatus: props.status
    }
});

const mapDispatchToProps = (dispatch) => ({
    doFlyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterStatusReduxForm);
