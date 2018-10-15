import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { withRouter } from 'react-router-dom';
import { flyttAktivitet } from '../../moduler/aktivitet/aktivitet-actions';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';
import { fullforAktivitetRoute, avbrytAktivitetRoute } from '../../routing';
import * as AppPT from '../../proptypes';
import KolonneHeader from './kolonneheader';

const mottaAktivitetsKort = {
    canDrop(props, monitor) {
        return props.status !== monitor.getItem().status;
    },

    drop({ doFlyttAktivitet, status, history }, monitor) {
        const aktivitet = monitor.getItem();
        // utsett håndteringen til droppet er fullført. Unngår f.eks. F17HL3-144
        setTimeout(() => {
            if (status === STATUS_FULLFOERT) {
                history.push(fullforAktivitetRoute(aktivitet.id));
            } else if (status === STATUS_AVBRUTT) {
                history.push(avbrytAktivitetRoute(aktivitet.id));
            } else {
                doFlyttAktivitet(aktivitet, status);
            }
        });
    },
};

function collect(theConnect, monitor) {
    return {
        drag: monitor.isOver(),
        connectDropTarget: theConnect.dropTarget(),
    };
}

function KolonneFunction({
    aktiviteter,
    status,
    tittelId,
    connectDropTarget,
    drag,
    render,
}) {
    return connectDropTarget(
        <div className="aktivitetstavle__kolonne-wrapper">
            <div
                className={classNames(
                    'aktivitetstavle__kolonne',
                    drag && 'aktivitetstavle__kolonne--drag'
                )}
            >
                <KolonneHeader status={status} tittelId={tittelId} />
                {render(aktiviteter)}
            </div>
        </div>
    );
}

KolonneFunction.propTypes = {
    status: PT.string.isRequired,
    tittelId: PT.string.isRequired,
    aktiviteter: PT.arrayOf(PT.object).isRequired,
    doFlyttAktivitet: PT.func.isRequired,
    render: PT.func.isRequired,
    history: AppPT.history.isRequired,
};
const mapDispatchToProps = dispatch => ({
    doFlyttAktivitet: (aktivitet, status) =>
        flyttAktivitet(aktivitet, status)(dispatch),
});

export default withRouter(
    connect(null, mapDispatchToProps)(
        DropTarget('AktivitetsKort', mottaAktivitetsKort, collect)(
            KolonneFunction
        )
    )
);
