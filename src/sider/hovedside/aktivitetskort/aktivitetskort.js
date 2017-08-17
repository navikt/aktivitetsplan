import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Lenke from '../../../felles-komponenter/utils/lenke';
import * as AppPT from '../../../proptypes';
import AktivitetskortTillegg from './aktivitetskort-tillegg';
import { formaterDato } from '../../../utils';
import { aktivitetRoute } from '../../../routing';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import {
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    BEHANDLING_AKTIVITET_TYPE,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    SAMTALEREFERAT_TYPE,
    MOTE_TYPE,
} from '../../../constant';
import { selectErBruker } from '../../../moduler/identitet/identitet-selector';
import { selectForrigeAktiveAktivitetId } from '../../../moduler/aktivitet/aktivitet-selector';

const dndSpec = {
    beginDrag({ aktivitet }) {
        return aktivitet;
    },
};

function collect(connector, monitor) {
    return {
        connectDragSource: connector.dragSource(),
        isDragging: monitor.isDragging(),
    };
}

class AktivitetsKort extends Component {
    componentDidUpdate() {
        const { forrigeAktiveAktivitetId, aktivitet } = this.props;
        if (
            forrigeAktiveAktivitetId &&
            forrigeAktiveAktivitetId === aktivitet.id
        ) {
            findDOMNode(this.aktivitetskortSomSkalFaFokusNarLukkes).focus(); // eslint-disable-line react/no-find-dom-node
        }
    }

    render() {
        const {
            aktivitet,
            isDragging,
            connectDragSource,
            erFlyttbar,
            erBehandlingAktivitet,
        } = this.props;
        const {
            id,
            type,
            tittel,
            fraDato,
            tilDato,
            antallStillingerSokes,
        } = aktivitet;

        const aktivitetsKort = (
            <article style={{ opacity: isDragging ? 0.4 : 1 }}>
                <Lenke
                    href={aktivitetRoute(id)}
                    className={classNames(
                        'aktivitetskort',
                        erFlyttbar && 'aktivitetskort--flyttbar'
                    )}
                    brukLenkestyling={false}
                    focusRef={aktivitetskort => {
                        this.aktivitetskortSomSkalFaFokusNarLukkes = aktivitetskort;
                    }}
                >
                    <Undertekst tag="p" className="aktivitetskort__type">
                        <FormattedMessage
                            id={`aktivitetskort.type.${type}`.toLowerCase()}
                        />
                    </Undertekst>
                    <Element tag="h1" className="aktivitetskort__tittel">
                        {erBehandlingAktivitet
                            ? <FormattedMessage id="aktivitetskort.behandling.tittel" />
                            : tittel}
                    </Element>
                    <Normaltekst className="aktivitetskort__dato">
                        {[formaterDato(fraDato), formaterDato(tilDato)]
                            .filter(d => d)
                            .join(' - ')}
                    </Normaltekst>
                    <VisibleIfDiv visible={type === SOKEAVTALE_AKTIVITET_TYPE}>
                        <FormattedMessage id="aktivitetskort.antall-label" />
                        &nbsp;
                        {antallStillingerSokes}
                    </VisibleIfDiv>
                    <AktivitetskortTillegg aktivitet={aktivitet} />
                </Lenke>
            </article>
        );

        return erFlyttbar ? connectDragSource(aktivitetsKort) : aktivitetsKort;
    }
}

AktivitetsKort.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,

    isDragging: PT.bool.isRequired,
    connectDragSource: PT.func.isRequired,

    forrigeAktiveAktivitetId: PT.string,
    erFlyttbar: PT.bool.isRequired,
    erBehandlingAktivitet: PT.bool.isRequired,
};

AktivitetsKort.defaultProps = {
    forrigeAktiveAktivitetId: undefined,
};

const dragbartAktivitetskort = DragSource('AktivitetsKort', dndSpec, collect)(
    AktivitetsKort
);

const mapStateToProps = (state, props) => {
    const { type, status, nesteStatus, historisk } = props.aktivitet;

    const erBruker = selectErBruker(state);

    const behandlingAktivitet = BEHANDLING_AKTIVITET_TYPE === type;
    const arenaAktivitet = [
        TILTAK_AKTIVITET_TYPE,
        GRUPPE_AKTIVITET_TYPE,
        UTDANNING_AKTIVITET_TYPE,
    ].includes(type);

    const erFlyttbar =
        !nesteStatus &&
        !historisk &&
        ![STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status) &&
        !arenaAktivitet &&
        !([SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker);

    return {
        forrigeAktiveAktivitetId: selectForrigeAktiveAktivitetId(state),
        erBehandlingAktivitet: behandlingAktivitet,
        erFlyttbar,
    };
};

export default connect(mapStateToProps)(dragbartAktivitetskort);
