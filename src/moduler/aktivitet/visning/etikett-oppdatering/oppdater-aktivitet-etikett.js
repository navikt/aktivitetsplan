import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import * as statuser from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import StillingEtikettForm from './stilling-etikett-form';
import { selectAktivitetMedId } from '../../aktivitetliste-selector';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';

function OppdaterAktivitetStatus({
    valgtAktivitet,
    status,
    className,
    underOppfolging,
}) {
    const disableStatusEndring =
        valgtAktivitet.historisk ||
        status === statuser.STATUS_AVBRUTT ||
        status === statuser.STATUS_FULLFOERT;

    const erStillingsAktivitet =
        valgtAktivitet.type === statuser.STILLING_AKTIVITET_TYPE;

    return (
        <section className={className}>
            <Undertittel>
                <FormattedMessage id="oppdater-aktivitet-etikett.header" />
            </Undertittel>
            <StillingEtikettForm
                visible={erStillingsAktivitet}
                disableStatusEndring={disableStatusEndring || !underOppfolging}
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
    underOppfolging: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
    valgtAktivitet: selectAktivitetMedId(state, props.paramsId),
    initialValues: {
        aktivitetstatus: props.status,
    },
    underOppfolging: selectErUnderOppfolging(state),
});

export default connect(mapStateToProps)(OppdaterAktivitetStatus);
