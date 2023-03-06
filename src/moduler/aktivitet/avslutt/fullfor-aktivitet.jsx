import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { STATUS } from '../../../api/utils';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import * as AppPT from '../../../proptypes';
import { fullforAktivitet } from '../aktivitet-actions';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import PubliserReferat from './publiser-referat';
import VisAdvarsel from './vis-advarsel';

const headerTekst = 'Fullført aktivitet';
const beskrivelseTekst =
    'Skriv en kort kommentar om hvordan det har gått, eller noe NAV bør kjenne til. ' +
    'Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.';

const FullforAktivitet = ({ valgtAktivitet, lagrer, doAvsluttOppfolging, history }) => {
    const begrunnelse = (
        <BegrunnelseAktivitet
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseTekst}
            lagrer={lagrer}
            onSubmit={(beskrivelseForm) => {
                history.replace('/');
                return doAvsluttOppfolging(valgtAktivitet, beskrivelseForm.begrunnelse);
            }}
        />
    );

    const advarsel = (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                doAvsluttOppfolging(valgtAktivitet, null);
                history.replace('/');
            }}
        />
    );

    return (
        <Modal header={<ModalHeader />} contentLabel="fullfor-aktivitet">
            <PubliserReferat aktivitet={valgtAktivitet}>
                {valgtAktivitet.avtalt &&
                valgtAktivitet.type !== SAMTALEREFERAT_TYPE &&
                valgtAktivitet.type !== MOTE_TYPE
                    ? begrunnelse
                    : advarsel}
            </PubliserReferat>
        </Modal>
    );
};

FullforAktivitet.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    lagrer: PT.bool.isRequired,
    doAvsluttOppfolging: PT.func.isRequired,
    history: AppPT.history.isRequired,
    match: PT.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    doAvsluttOppfolging: (aktivitet, begrunnelse) => dispatch(fullforAktivitet(aktivitet, begrunnelse)),
});

const mapStateToProps = (state, props) => {
    const aktivitetId = props.match.params.id;
    const valgtAktivitet = selectAktivitetMedId(state, aktivitetId);
    return {
        valgtAktivitet: valgtAktivitet || {},
        lagrer: selectAktivitetListeStatus(state) !== STATUS.OK,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FullforAktivitet);
