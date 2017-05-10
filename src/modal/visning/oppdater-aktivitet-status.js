import React from 'react';
import PT from 'prop-types'
import { connect } from 'react-redux';
import Undertittel from 'nav-frontend-typografi/src/undertittel';
import * as statuser from '../../constant';
import * as AppPT from '../../proptypes';
import StillingEtikettForm from '../skjema/stilling-etikett-form';
import AktivitetStatusForm from '../skjema/aktivitet-status-form';

function OppdaterAktivitetStatus(props) {
    const { aktiviteter, paramsId } = props;
    const disableStatusEndring = props.status === statuser.STATUS_AVBRUTT ||
        props.status === statuser.STATUS_FULLFOERT;
    const valgtAktivitet = aktiviteter.data.find((aktivitet) => aktivitet.id === paramsId);
    const erStillingsAktivitet = valgtAktivitet.type === statuser.STILLING_AKTIVITET_TYPE;

    return (
        <section className={props.className}>
            <Undertittel className="blokk-s">
                Oppdater status
            </Undertittel>
            <div className="skjema oppdater-statuser-radioform blokk-m">
                <AktivitetStatusForm disableStatusEndring={disableStatusEndring} aktivitet={valgtAktivitet} />
                {
                    erStillingsAktivitet &&
                    <StillingEtikettForm disableStatusEndring={disableStatusEndring} aktivitet={valgtAktivitet} />
                }
            </div>
        </section>
    );
}

OppdaterAktivitetStatus.propTypes = {
    status: PT.string.isRequired,
    paramsId: PT.string.isRequired,
    className: PT.string.isRequired,
    aktiviteter: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.aktivitet)
    }).isRequired
};

const mapStateToProps = (state, props) => ({
    aktiviteter: state.data.aktiviteter,
    initialValues: {
        aktivitetstatus: props.status
    }
});

export default connect(mapStateToProps, null)(OppdaterAktivitetStatus);
