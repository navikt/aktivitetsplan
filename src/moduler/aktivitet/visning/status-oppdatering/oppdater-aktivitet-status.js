import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../../../proptypes';
import AktivitetStatusForm from './aktivitet-status-form';
import {
    selectAktivitetMedId,
    selectKanEndreAktivitetStatus,
} from '../../aktivitetliste-selector';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';

function OppdaterAktivitetStatus({
    className,
    valgtAktivitet,
    disableStatusEndring,
}) {
    return (
        <section className={className}>
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
    className: PT.string.isRequired,
    valgtAktivitet: AppPT.aktivitet.isRequired,
    disableStatusEndring: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);
    return {
        valgtAktivitet,
        disableStatusEndring:
            !selectKanEndreAktivitetStatus(state, valgtAktivitet) ||
            !selectErUnderOppfolging(state),
        initialValues: {
            aktivitetstatus: props.status,
        },
    };
};

export default connect(mapStateToProps, null)(OppdaterAktivitetStatus);
