import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-react-design/dist/typografi';
import { flyttAktivitet } from '../../ducks/aktiviteter';
import AktivitetsKort from './aktivitetskort';

const mottaAktivitetsKort = {

    canDrop() {
        return true;
    },

    drop({ doFlyttAktivitet, status }, monitor) {
        doFlyttAktivitet(monitor.getItem(), status);
    }
};

function collect(theConnect, monitor) {
    return {
        drag: monitor.isOver(),
        connectDropTarget: theConnect.dropTarget()
    };
}

function KolonneFunction({ aktiviteter, status, tittelId, connectDropTarget, drag }) {
    const aktivitetsKort = aktiviteter
        .filter((a) => (a.nesteStatus ? a.nesteStatus === status : a.status === status))
        .sort((a, b) => b.opprettetDato - a.opprettetDato)
        .map((a) => <AktivitetsKort key={a.id} aktivitet={a} />);

    return connectDropTarget(
        <div className="aktivitetstavle__kolonne-wrapper">
            <section className={classNames('aktivitetstavle__kolonne', drag && 'aktivitetstavle__kolonne--drag')}>
                <Undertittel className="aktivitetstavle__kolonne-header">
                    <FormattedMessage id={tittelId} />
                </Undertittel>
                {aktivitetsKort}
            </section>
        </div>
    );
}

KolonneFunction.propTypes = {
    status: PT.string.isRequired,
    tittelId: PT.string.isRequired,
    aktiviteter: PT.arrayOf(PT.object).isRequired,
    doFlyttAktivitet: PT.func.isRequired
};

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter
});

const mapDispatchToProps = (dispatch) => ({
    doFlyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
    DropTarget('AktivitetsKort', mottaAktivitetsKort, collect)(KolonneFunction)
);
