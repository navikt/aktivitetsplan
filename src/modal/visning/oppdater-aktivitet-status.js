import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import * as aktivitetstatus from '../../constant';
import Undertittel from "nav-frontend-typografi/src/undertittel";
import Radio from "nav-frontend-skjema/src/radio";
import AktivitetEtiketter from '../../felles-komponenter/aktivitet-etiketter';

function OppdaterAktivitetStatus(props) {

    const erChecked = id => props.status === id;
    const radioSkjema = (
        <div className="skjema blokk-m">
            <Radio
                label="Foreslått"
                value={aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT}
                id={`id--${aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT}`}
                name="aktivitetstatus"
                defaultChecked={erChecked(aktivitetstatus.STATUS_BRUKER_ER_INTRESSERT)}
            />
            <Radio
                label="Planlagt"
                value={aktivitetstatus.STATUS_PLANLAGT}
                id={`id--${aktivitetstatus.STATUS_PLANLAGT}`}
                name="aktivitetstatus"
                defaultChecked={erChecked(aktivitetstatus.STATUS_PLANLAGT)}
            />
            <Radio
                label="Gjennomføres"
                value={aktivitetstatus.STATUS_GJENNOMFOERT}
                id={`id--${aktivitetstatus.STATUS_GJENNOMFOERT}`}
                name="aktivitetstatus"
                defaultChecked={erChecked(aktivitetstatus.STATUS_GJENNOMFOERT)}
            />
            <Radio
                label="Fullført"
                value={aktivitetstatus.STATUS_FULLFOERT}
                id={`id--${aktivitetstatus.STATUS_FULLFOERT}`}
                name="aktivitetstatus"
                defaultChecked={erChecked(aktivitetstatus.STATUS_FULLFOERT)}
            />
            <Radio
                label="Avbrutt"
                value={aktivitetstatus.STATUS_AVBRUTT}
                id={`id--${aktivitetstatus.STATUS_AVBRUTT}`}
                name="aktivitetstatus"
                defaultChecked={erChecked(aktivitetstatus.STATUS_AVBRUTT)}
            />
        </div>
    );
    return (
        <section>
            <Undertittel className="blokk-s">
                Oppdater status
            </Undertittel>
            {radioSkjema}
            <AktivitetEtiketter etiketter={props.tagger} className="aktivitetvisning__etikett" />
        </section>
    );
}

OppdaterAktivitetStatus.propTypes ={
    status: PT.string.isRequired,
    tagger: PT.arrayOf(PT.shape({
        type: PT.string,
        tag: PT.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter.data
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterAktivitetStatus);
