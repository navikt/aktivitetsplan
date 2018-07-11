import React from 'react';
import PT from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { slettAktivitet } from '../../aktivitet-actions';
import BekreftSlettVisning from './bekreft-slett-visning';
import * as AppPT from '../../../../proptypes';
import Modal from '../../../../felles-komponenter/modal/modal';
import { selectAktivitetMedId } from '../../aktivitetliste-selector';

function BekreftSlettVisningContainer({
    doSlettAktivitet,
    valgtAktivitet,
    history,
}) {
    return (
        <Modal contentLabel="aktivitetsvisningModal">
            <BekreftSlettVisning
                slettAction={() => {
                    doSlettAktivitet(valgtAktivitet);
                    history.push('/');
                }}
                avbrytAction={() =>
                    history.push(`aktivitet/vis/${valgtAktivitet.id}`)}
                tittelId="aktivitetvisning.bekreft-sletting.tittel"
            />
        </Modal>
    );
}

BekreftSlettVisningContainer.defaultProps = {
    doSlettAktivitet: undefined,
    valgtAktivitet: undefined,
};

BekreftSlettVisningContainer.propTypes = {
    doSlettAktivitet: PT.func,
    aktivitetId: PT.string.isRequired,
    history: AppPT.history.isRequired,
    valgtAktivitet: AppPT.aktivitet,
};

const mapStateToProps = (state, props) => ({
    valgtAktivitet: selectAktivitetMedId(state, props.aktivitetId),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            doSlettAktivitet: slettAktivitet,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(
    BekreftSlettVisningContainer
);
