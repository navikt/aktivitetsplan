import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import * as statuser from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import StillingEtikettForm from './stilling-etikett-form';
import { selectAktivitetMedId } from '../../aktivitetliste-selector';
import { erPrivateBrukerSomSkalSkrusAv } from '../../../privat-modus/privat-modus-selector';

function OppdaterAktivitetStatus(props) {
    const { valgtAktivitet, status } = props;

    const disableStatusEndring =
        valgtAktivitet.historisk ||
        status === statuser.STATUS_AVBRUTT ||
        status === statuser.STATUS_FULLFOERT;

    const erStillingsAktivitet =
        valgtAktivitet.type === statuser.STILLING_AKTIVITET_TYPE;

    return (
        <section className={props.className}>
            <Undertittel>
                <FormattedMessage id="oppdater-aktivitet-etikett.header" />
            </Undertittel>
            <StillingEtikettForm
                visible={erStillingsAktivitet}
                disableStatusEndring={disableStatusEndring || props.privateMode}
                aktivitet={valgtAktivitet}
            />
        </section>
    );
}

OppdaterAktivitetStatus.propTypes = {
    status: PT.string.isRequired,
    paramsId: PT.string.isRequired,
    className: PT.string.isRequired,
    valgtAktivitet: AppPT.aktivitet.isRequired,
    privateMode: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
    valgtAktivitet: selectAktivitetMedId(state, props.paramsId),
    initialValues: {
        aktivitetstatus: props.status,
    },
    privateMode: erPrivateBrukerSomSkalSkrusAv(state),
});

export default connect(mapStateToProps)(OppdaterAktivitetStatus);
