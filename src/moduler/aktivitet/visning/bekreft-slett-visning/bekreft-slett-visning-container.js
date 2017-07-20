import React from 'react';
import PT from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { slettAktivitet } from '../../aktivitet-actions';
import BekreftSlettVisning from './bekreft-slett-visning';
import StandardModal from '../../../../felles-komponenter/modal/modal-standard';
import history from '../../../../history';
import * as AppPT from '../../../../proptypes';

function BekreftSlettVisningContainer({
    doSlettAktivitet,
    aktiviteter,
    params,
}) {
    const { id } = params;
    const valgtAktivitet = aktiviteter.data.find(
        aktivitet => aktivitet.id === id
    );

    return (
        <StandardModal name="aktivitetsvisningModal">
            <BekreftSlettVisning
                slettAction={() => {
                    doSlettAktivitet(valgtAktivitet);
                    history.push('/');
                }}
                avbrytAction={() =>
                    history.push(`aktivitet/vis/${valgtAktivitet.id}`)}
            />
        </StandardModal>
    );
}

BekreftSlettVisningContainer.defaultProps = {
    doSlettAktivitet: undefined,
    aktiviteter: undefined,
};

BekreftSlettVisningContainer.propTypes = {
    doSlettAktivitet: PT.func,
    aktiviteter: AppPT.reducer,
    params: PT.shape({ id: PT.string }).isRequired,
};

const mapStateToProps = state => ({
    aktiviteter: state.data.aktiviteter,
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
