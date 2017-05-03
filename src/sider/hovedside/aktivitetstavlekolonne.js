import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Bilde from 'nav-react-design/dist/bilde';
import { DropTarget } from 'react-dnd';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { flyttAktivitet } from '../../ducks/aktiviteter';
import AktivitetsKort from './aktivitetskort';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';
import history from './../../history';
import hengelasSvg from '../../img/hengelas.svg';

const mottaAktivitetsKort = {

    canDrop(props, monitor) {
        return (props.status !== monitor.getItem().status);
    },

    drop({ doFlyttAktivitet, status }, monitor) {
        const aktivitet = monitor.getItem();
        if (status === STATUS_FULLFOERT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/fullfor`);
        } else if (status === STATUS_AVBRUTT && aktivitet.avtalt) {
            history.push(`/aktivitet/aktivitet/${aktivitet.id}/avbryt`);
        } else {
            doFlyttAktivitet(aktivitet, status);
        }
    }
};

function collect(theConnect, monitor) {
    return {
        drag: monitor.isOver(),
        connectDropTarget: theConnect.dropTarget()
    };
}

function compareOpprettetDate(a, b) {
    if (b > a) return 1;
    else if (b < a) return -1;
    return 0;
}

function KolonneFunction({ aktiviteter, status, tittelId, connectDropTarget, drag }) {
    const aktivitetsKort = aktiviteter
        .filter((a) => (a.nesteStatus ? a.nesteStatus === status : a.status === status))
        .sort((a, b) => compareOpprettetDate(a.opprettetDato, b.opprettetDato))
        .map((a) => <AktivitetsKort key={a.id} aktivitet={a} />);

    return connectDropTarget(
        <div className="aktivitetstavle__kolonne-wrapper">
            <section className={classNames('aktivitetstavle__kolonne', drag && 'aktivitetstavle__kolonne--drag')}>
                <Undertittel className="aktivitetstavle__kolonne-header">
                    <FormattedMessage id={tittelId} />
                    {{ [STATUS_FULLFOERT]: true, [STATUS_AVBRUTT]: true }[status] &&
                        <Bilde className="aktivitetstavle__kolonne-header-bilde" src={hengelasSvg} alt="hengelåsikon" />
                    }
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
    aktiviteter: state.data.aktiviteter.data
});

const mapDispatchToProps = (dispatch) => ({
    doFlyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
    DropTarget('AktivitetsKort', mottaAktivitetsKort, collect)(KolonneFunction)
);
