import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { HjelpetekstVenstre, HjelpetekstHoyre } from 'nav-frontend-hjelpetekst';
import { flyttAktivitet } from '../../../ducks/aktiviteter';
import AktivitetsKort from '../aktivitetskort/aktivitetskort';
import {
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
} from '../../../constant';
import history from '../../../history';
import { fullforAktivitetRoute, avbrytAktivitetRoute } from '../../../routing';

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

function HengelasAnchor() {
    return (
        <FormattedMessage id="minkey.las">
            {tekst => <span aria-label={tekst} />}
        </FormattedMessage>
    );
}

function SporsmalAnchor() {
    return (
        <FormattedMessage id="minkey.spm">
            {tekst => <span aria-label={tekst} />}
        </FormattedMessage>
    );
}

function hjelpetekst(aktivitetStatus) {
    switch (aktivitetStatus) {
        case STATUS_BRUKER_ER_INTRESSERT:
            return (
                <FormattedMessage id="hjelpetekst.tittel.aktivitet.apen">
                    {tekst => (
                        <HjelpetekstHoyre
                            anchor={SporsmalAnchor}
                            tittel={tekst}
                        >
                            <FormattedMessage id="hjelpetekst.sporsmalikon" />
                        </HjelpetekstHoyre>
                    )}
                </FormattedMessage>
            );
        case STATUS_PLANLAGT:
        case STATUS_GJENNOMFOERT:
            return (
                <FormattedMessage id="hjelpetekst.tittel.aktivitet.apen">
                    {tekst => (
                        <HjelpetekstVenstre
                            anchor={SporsmalAnchor}
                            tittel={tekst}
                        >
                            <FormattedMessage id="hjelpetekst.sporsmalikon" />
                        </HjelpetekstVenstre>
                    )}
                </FormattedMessage>
            );

        case STATUS_FULLFOERT:
        case STATUS_AVBRUTT:
            return (
                <FormattedMessage id="hjelpetekst.tittel.aktivitet.last">
                    {tekst => (
                        <HjelpetekstVenstre
                            anchor={HengelasAnchor}
                            tittel={tekst}
                        >
                            <FormattedMessage id="hjelpetekst.lasikon" />
                        </HjelpetekstVenstre>
                    )}
                </FormattedMessage>
            );
        default:
            return null;
    }
}

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

function compareAktivitet(a, b) {
    if (b.avtalt && !a.avtalt) {
        return 1;
    } else if (!b.avtalt && a.avtalt) {
        return -1;
    }
    return b.opprettetDato.localeCompare(a.opprettetDato);
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
        .sort((a, b) => compareAktivitet(a, b))
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
                    className={`aktivitetstavle__kolonne-header-wrapper ${hjelpeklasse(status)}`}
                >
                    <Undertittel
                        className="aktivitetstavle__kolonne-header"
                        tag="h1"
                    >
                        <FormattedMessage id={tittelId} />
                    </Undertittel>
                    {hjelpetekst(status)}
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
    aktiviteter: state.data.aktiviteter.data.concat(
        state.data.arenaAktiviteter.data
    ),
});

const mapDispatchToProps = dispatch => ({
    doFlyttAktivitet: (aktivitet, status) =>
        flyttAktivitet(aktivitet, status)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    DropTarget('AktivitetsKort', mottaAktivitetsKort, collect)(KolonneFunction)
);
