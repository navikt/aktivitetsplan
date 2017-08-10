import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-for-ferdig-avtalt-aktivitet';
import VisAdvarsel from './vis-advarsel';
import { avbrytAktivitet } from '../aktivitet-actions';
import { STATUS } from '../../../ducks/utils';
import StandardModal from '../../../felles-komponenter/modal/modal-standard';
import history from '../../../history';
import { selectRouteParams } from '../../../routing';
import {
    selectAktivitetListeStatus,
    selectAktivitetMedId,
} from '../aktivitetliste-selector';
import PubliserReferat from './publiser-referat';

const AvbrytAktivitet = ({ lagrer, valgtAktivitet, lagreBegrunnelse }) => {
    const begrunnelse = (
        <BegrunnelseAktivitet
            aktivitet={valgtAktivitet}
            headerTekst={
                <FormattedMessage id="opprett-begrunnelse.avbrutt.header" />
            }
            beskrivelseTekst={
                <FormattedMessage id="opprett-begrunnelse.avbrutt.melding" />
            }
            lagrer={lagrer}
            onSubmit={beskrivelseForm => {
                lagreBegrunnelse(valgtAktivitet, beskrivelseForm.begrunnelse);
                history.goBack();
            }}
        />
    );

    const advarsel = (
        <VisAdvarsel
            headerTekst={<FormattedMessage id="advarsel.avbrutt.header" />}
            onSubmit={() => {
                lagreBegrunnelse(valgtAktivitet, null);
                history.goBack();
            }}
        />
    );

    return (
        <StandardModal name="BegrunnelseModal">
            <PubliserReferat aktivitet={valgtAktivitet}>
                {valgtAktivitet.avtalt ? begrunnelse : advarsel}
            </PubliserReferat>
        </StandardModal>
    );
};

AvbrytAktivitet.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    lagrer: PT.bool.isRequired,
    lagreBegrunnelse: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    lagreBegrunnelse: (aktivitet, begrunnelse) =>
        dispatch(avbrytAktivitet(aktivitet, begrunnelse)),
});

const mapStateToProps = (state, props) => {
    const aktivitetId = selectRouteParams(props).id;
    const valgtAktivitet = selectAktivitetMedId(state, aktivitetId);
    return {
        valgtAktivitet: valgtAktivitet || {},
        lagrer: selectAktivitetListeStatus(state) !== STATUS.OK,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AvbrytAktivitet);
