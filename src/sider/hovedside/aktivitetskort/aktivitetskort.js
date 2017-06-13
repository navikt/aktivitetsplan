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
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
} from '../../../constant';

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
        const { aktivAktivitetId, aktivitet } = this.props;
        if (aktivAktivitetId && aktivAktivitetId === aktivitet.id) {
            findDOMNode(this.aktivitetskortSomSkalFaFokusNarLukkes).focus(); // eslint-disable-line react/no-find-dom-node
        }
    }

    render() {
        const {
            aktivitet,
            isDragging,
            connectDragSource,
        } = this.props;

        const arenaAktivitet = [
            TILTAK_AKTIVITET_TYPE,
            GRUPPE_AKTIVITET_TYPE,
            UTDANNING_AKTIVITET_TYPE,
        ].includes(aktivitet.type);
        const erFlyttbar =
            !aktivitet.nesteStatus &&
            ![STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status) &&
            !arenaAktivitet;
        const aktivitetsKort = (
            <article
                style={{ opacity: isDragging ? 0.4 : 1 }}
            >
                <Lenke
                    href={aktivitetRoute(aktivitet.id)}
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
                            id={`aktivitetskort.type.${aktivitet.type}`.toLowerCase()}
                        />
                    </Undertekst>
                    <Element tag="h1" className="aktivitetskort__tittel">
                        {aktivitet.tittel}
                    </Element>
                    <Normaltekst className="aktivitetskort__dato">
                        {[
                            formaterDato(aktivitet.fraDato),
                            formaterDato(aktivitet.tilDato),
                        ]
                            .filter(d => d)
                            .join(' - ')}
                    </Normaltekst>
                    <VisibleIfDiv
                        visible={aktivitet.type === SOKEAVTALE_AKTIVITET_TYPE}
                    >
                        <FormattedMessage id="aktivitetskort.antall-label" />
                        &nbsp;
                        {aktivitet.antall}
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
    aktivAktivitetId: PT.string,
};

AktivitetsKort.defaultProps = {
    aktivAktivitetId: undefined,
};

const dragbartAktivitetskort = DragSource('AktivitetsKort', dndSpec, collect)(
    AktivitetsKort
);

const mapStateToProps = state => ({
    aktivAktivitetId: state.data.aktiviteter.aktivAktivitetId,
});

export default connect(mapStateToProps)(dragbartAktivitetskort);
