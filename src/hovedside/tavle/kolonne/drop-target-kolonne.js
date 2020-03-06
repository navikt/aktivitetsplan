import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { withRouter } from 'react-router-dom';
import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../constant';
import * as AppPT from '../../../proptypes';
import { flyttAktivitet } from '../../../moduler/aktivitet/aktivitet-actions';
import { flyttetAktivitetMetrikk } from '../../../felles-komponenter/utils/logging';
import { avbrytAktivitetRoute, fullforAktivitetRoute } from '../../../routes';

const mottaAktivitetsKort = {
    canDrop(props, monitor) {
        return props.status !== monitor.getItem().status;
    },

    drop({ doFlyttAktivitet, status, history, harNyDialog }, monitor) {
        const aktivitet = monitor.getItem();
        // utsett håndteringen til droppet er fullført. Unngår f.eks. F17HL3-144
        setTimeout(() => {
            flyttetAktivitetMetrikk('dragAndDrop', aktivitet, status, harNyDialog);
            if (status === STATUS_FULLFOERT) {
                history.push(fullforAktivitetRoute(aktivitet.id));
            } else if (status === STATUS_AVBRUTT) {
                history.push(avbrytAktivitetRoute(aktivitet.id));
            } else {
                doFlyttAktivitet(aktivitet, status);
            }
        });
    }
};

function collect(theConnect, monitor) {
    return {
        drag: monitor.isOver(),
        connectDropTarget: theConnect.dropTarget()
    };
}

function DropTargetKolonne({ connectDropTarget, drag, children }) {
    return connectDropTarget(
        <div className="aktivitetstavle__kolonne-wrapper">
            <div className={classNames('aktivitetstavle__kolonne', drag && 'aktivitetstavle__kolonne--drag')}>
                {children}
            </div>
        </div>
    );
}

DropTargetKolonne.propTypes = {
    status: PT.string.isRequired,
    doFlyttAktivitet: PT.func.isRequired,
    history: AppPT.history.isRequired,
    children: PT.node
};

const mapDispatchToProps = dispatch => ({
    doFlyttAktivitet: (aktivitet, status) => flyttAktivitet(aktivitet, status)(dispatch)
});

export default withRouter(
    connect(null, mapDispatchToProps)(DropTarget('AktivitetsKort', mottaAktivitetsKort, collect)(DropTargetKolonne))
);
