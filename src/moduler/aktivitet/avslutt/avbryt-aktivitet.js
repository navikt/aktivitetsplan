import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { STATUS_AVBRUTT } from '../../../constant';
import { STATUS } from '../../../ducks/utils';
import Modal from '../../../felles-komponenter/modal/modal';
import * as AppPT from '../../../proptypes';
import { avbrytAktivitet } from '../aktivitet-actions';
import { trengerBegrunnelse } from '../aktivitet-util';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import BegrunnelseAktivitet from './begrunnelse-form';
import PubliserReferat from './publiser-referat';
import VisAdvarsel from './vis-advarsel';

const headerTekst = 'Avbrutt aktivitet';
const beskrivelseLabel =
    'Skriv en kort begrunnelse under om hvorfor du avbrøt aktiviteten. ' +
    'Når du lagrer blir aktiviteten låst, og du kan ikke lenger redigere innholdet. Etter at du har lagret, ' +
    'må du gi beskjed til  veilederen din ved å starte en dialog her i aktivitetsplanen.';

const AvbrytAktivitet = ({ lagrer, valgtAktivitet, lagreBegrunnelse, history }) => {
    const begrunnelse = (
        <BegrunnelseAktivitet
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseLabel}
            lagrer={lagrer}
            onSubmit={(beskrivelseForm) => {
                history.replace('/');
                return lagreBegrunnelse(valgtAktivitet, beskrivelseForm.begrunnelse);
            }}
        />
    );

    const advarsel = (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                lagreBegrunnelse(valgtAktivitet, null);
                history.replace('/');
            }}
        />
    );

    const maaBegrunnes = trengerBegrunnelse(valgtAktivitet.avtalt, STATUS_AVBRUTT, valgtAktivitet.type);

    return (
        <Modal contentLabel="avbryt-aktivitet">
            <PubliserReferat aktivitet={valgtAktivitet} nyStatus={STATUS_AVBRUTT}>
                {maaBegrunnes ? begrunnelse : advarsel}
            </PubliserReferat>
        </Modal>
    );
};

AvbrytAktivitet.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    lagrer: PT.bool.isRequired,
    lagreBegrunnelse: PT.func.isRequired,
    history: AppPT.history.isRequired,
    match: PT.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    lagreBegrunnelse: (aktivitet, begrunnelse) => dispatch(avbrytAktivitet(aktivitet, begrunnelse)),
});

const mapStateToProps = (state, props) => {
    const aktivitetId = props.match.params.id;
    const valgtAktivitet = selectAktivitetMedId(state, aktivitetId);
    return {
        valgtAktivitet: valgtAktivitet || {},
        lagrer: selectAktivitetListeStatus(state) !== STATUS.OK,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AvbrytAktivitet);
