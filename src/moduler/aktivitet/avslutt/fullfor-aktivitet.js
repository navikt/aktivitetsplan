import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as AppPT from '../../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-form';
import { fullforAktivitet } from '../aktivitet-actions';
import { STATUS } from '../../../ducks/utils';
import VisAdvarsel from './vis-advarsel';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetliste-selector';
import PubliserReferat from './publiser-referat';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';

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
