import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import AktivitetsplanHjelpetekst from '../../moduler/hjelpetekst/aktivitetsplan-hjelpetekst';
import { flyttAktivitet } from '../../moduler/aktivitet/aktivitet-actions';
import AktivitetsKort from '../../moduler/aktivitet/aktivitet-kort/aktivitetskort';
import {
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
} from '../../constant';
import history from '../../history';
import { fullforAktivitetRoute, avbrytAktivitetRoute } from '../../routing';
import { selectAktivitetListe } from '../../moduler/aktivitet/aktivitetliste-selector';
import { compareAktivitet } from '../../moduler/aktivitet/aktivitet-util';

const mottaAktivitetsKort = {
    canDrop(props, monitor) {
        return props.status !== monitor.getItem().status;
    },

    drop({ doFlyttAktivitet, status }, monitor) {
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

function hjelpeklasse(aktivitetStatus) {
    switch (aktivitetStatus) {
        case STATUS_BRUKER_ER_INTRESSERT:
        case STATUS_PLANLAGT:
        case STATUS_GJENNOMFOERT:
            return 'aktivitet-apen';

        case STATUS_FULLFOERT:
        case STATUS_AVBRUTT:
            return 'aktivitet-last';

        default:
            return null;
    }
}

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
}) {
    const aktivitetsKort = aktiviteter
        .filter(a => {
            if (a.nesteStatus) {
                return a.nesteStatus === status;
            }
            return a.status === status;
        })
        .sort(compareAktivitet)
        .map(a => <AktivitetsKort key={a.id} aktivitet={a} />);

    return connectDropTarget(
        <div className="aktivitetstavle__kolonne-wrapper">
            <div
                className={classNames(
                    'aktivitetstavle__kolonne',
                    drag && 'aktivitetstavle__kolonne--drag'
                )}
            >
                <div
                    className={`aktivitetstavle__kolonne-header-wrapper ${hjelpeklasse(
                        status
                    )}`}
                >
                    <Undertittel
                        className="aktivitetstavle__kolonne-header"
                        tag="h1"
                    >
                        <FormattedMessage id={tittelId} />
                    </Undertittel>
                    <AktivitetsplanHjelpetekst status={status} />
                </div>
                {aktivitetsKort}
            </div>
        </div>
    );
}

KolonneFunction.propTypes = {
    status: PT.string.isRequired,
    tittelId: PT.string.isRequired,
    aktiviteter: PT.arrayOf(PT.object).isRequired,
    doFlyttAktivitet: PT.func.isRequired,
};

const mapStateToProps = state => ({
    aktiviteter: selectAktivitetListe(state),
});

const mapDispatchToProps = dispatch => ({
    doFlyttAktivitet: (aktivitet, status) =>
        flyttAktivitet(aktivitet, status)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    DropTarget('AktivitetsKort', mottaAktivitetsKort, collect)(KolonneFunction)
);
