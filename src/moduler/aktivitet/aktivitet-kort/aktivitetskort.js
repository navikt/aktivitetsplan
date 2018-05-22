import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import { Undertekst, Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import AktiviteskortPeriodeVisning from './aktivitetskort-periode';
import Lenke from '../../../felles-komponenter/utils/lenke';
import * as AppPT from '../../../proptypes';
import AktivitetskortTillegg from './aktivitetskort-tillegg';
import { aktivitetRoute } from '../../../routing';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import {
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
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
        } = this.props;
        const { id, type, tittel, antallStillingerSokes } = aktivitet;

        const ariaLabel = `aktivitetskort__header__${id} aktivitetskort__dato__${id}`;

        const aktivitetsKort = (
            <div>
                <Lenke
                    href={aktivitetRoute(id)}
                    draggable={erFlyttbar}
                    className={classNames('aktivitetskort', {
                        'aktivitetskort--flyttbar': erFlyttbar,
                        'aktivitetskort--drag': isDragging,
                    })}
                    brukLenkestyling={false}
                    focusRef={aktivitetskort => {
                        this.aktivitetskortSomSkalFaFokusNarLukkes = aktivitetskort;
                    }}
                >
                    <article aria-labelledby={ariaLabel}>
                        <Undertekst
                            tag="p"
                            className="aktivitetskort__type"
                            data-testId={type}
                        >
                            <FormattedMessage
                                id={`aktivitetskort.type.${type}`.toLowerCase()}
                            />
                        </Undertekst>
                        <Element
                            tag="h1"
                            id={`aktivitetskort__header__${id}`}
                            className={classNames(
                                'aktivitetskort__tittel softbreak',
                                {
                                    'aktivitetskort__tittel--drag': isDragging,
                                }
                            )}
                        >
                            {tittel}
                        </Element>
                        <AktiviteskortPeriodeVisning aktivitet={aktivitet} />
                        <VisibleIfDiv
                            visible={
                                type === SOKEAVTALE_AKTIVITET_TYPE &&
                                antallStillingerSokes > 0
                            }
                        >
                            <FormattedMessage id="aktivitetskort.antall-label" />
                            &nbsp;
                            {antallStillingerSokes}
                        </VisibleIfDiv>
                        <AktivitetskortTillegg aktivitet={aktivitet} />
                    </article>
                </Lenke>
            </div>
        );

        return erFlyttbar ? connectDragSource(aktivitetsKort) : aktivitetsKort;
    }
}

function sjekkErFlyttbar(aktivitet, erBruker) {
    const { type, status, nesteStatus, historisk } = aktivitet;
    const erArenaAktivitet = [
        TILTAK_AKTIVITET_TYPE,
        GRUPPE_AKTIVITET_TYPE,
        UTDANNING_AKTIVITET_TYPE,
    ].includes(type);
    const erFerdig = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const brukerKanOppdater =
        [SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker;
    return (
        !nesteStatus &&
        !historisk &&
        !erFerdig &&
        !erArenaAktivitet &&
        !brukerKanOppdater
    );
}

AktivitetsKort.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    isDragging: PT.bool.isRequired,
    connectDragSource: PT.func.isRequired,
    forrigeAktiveAktivitetId: PT.string,
    erFlyttbar: PT.bool.isRequired,
};

AktivitetsKort.defaultProps = {
    forrigeAktiveAktivitetId: undefined,
};

const dragbartAktivitetskort = DragSource('AktivitetsKort', dndSpec, collect)(
    AktivitetsKort
);

const mapStateToProps = (state, props) => ({
    forrigeAktiveAktivitetId: selectForrigeAktiveAktivitetId(state),
    erFlyttbar: sjekkErFlyttbar(props.aktivitet, selectErBruker(state)),
});

export default connect(mapStateToProps)(dragbartAktivitetskort);
