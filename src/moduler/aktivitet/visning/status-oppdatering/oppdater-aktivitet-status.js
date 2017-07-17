import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import * as statuser from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import AktivitetStatusForm from './aktivitet-status-form';

function OppdaterAktivitetStatus(props) {
    const { aktiviteter, paramsId } = props;
    const disableStatusEndring =
        props.status === statuser.STATUS_AVBRUTT ||
        props.status === statuser.STATUS_FULLFOERT;
    const valgtAktivitet = aktiviteter.data.find(
        aktivitet => aktivitet.id === paramsId
    );

    return (
        <section className={props.className}>
            <Undertittel>
                <FormattedMessage id="oppdater-aktivitet-status.header" />
            </Undertittel>
            <AktivitetStatusForm
                disableStatusEndring={disableStatusEndring}
                aktivitet={valgtAktivitet}
            />
        </section>
    );
}

OppdaterAktivitetStatus.propTypes = {
    status: PT.string.isRequired,
    paramsId: PT.string.isRequired,
    className: PT.string.isRequired,
    aktiviteter: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.aktivitet),
    }).isRequired,
};

const mapStateToProps = (state, props) => ({
    aktiviteter: state.data.aktiviteter,
    initialValues: {
        aktivitetstatus: props.status,
    },
});

export default connect(mapStateToProps, null)(OppdaterAktivitetStatus);
