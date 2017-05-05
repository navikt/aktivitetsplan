import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import Lenke from './../../felles-komponenter/utils/lenke';
import * as AppPT from '../../proptypes';
import AktivitetskortTillegg from './aktivitetskort-tillegg';
import TallAlert from '../../felles-komponenter/tall-alert';
import VisibleIfDiv from '../../felles-komponenter/utils/visibleIfDiv';
import { formaterDato } from '../../utils';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';

const dndSpec = {

    beginDrag({ aktivitet }) {
        return aktivitet;
    }

};

function collect(connector, monitor) {
    return {
        connectDragSource: connector.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function AktivitetsKort({ aktivitet, antallUlesteHenvendelser, isDragging, connectDragSource }) {
    const erFlyttbar = !aktivitet.nesteStatus && ![STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status);

    const aktivitetsKort = (
        <article style={{ opacity: isDragging ? 0.4 : 1 }}>
            <Lenke
                href={`aktivitet/aktivitet/${aktivitet.id}`}
                className={classNames('aktivitetskort', erFlyttbar && 'aktivitetskort--flyttbar')}
                brukLenkestyling={false}
            >
                <div className="aktivitetskort__wrapper">
                    <div className="aktivitetskort__blokk">
                        <Undertekst tag="p" className="aktivitetskort__type">{aktivitet.type}</Undertekst>
                        <Element tag="h1" className="aktivitetskort__tittel">{aktivitet.tittel}</Element>
                        <Normaltekst>{ [formaterDato(aktivitet.fraDato), formaterDato(aktivitet.tilDato)].filter((d) => d).join(' - ') }</Normaltekst>
                        <VisibleIfDiv visible={antallUlesteHenvendelser > 0} className="aktivitetskort__henvendelser">
                            <TallAlert>{antallUlesteHenvendelser}</TallAlert>
                        </VisibleIfDiv>
                    </div>
                    <AktivitetskortTillegg aktivitet={aktivitet} />
                </div>
            </Lenke>
        </article>
    );

    return erFlyttbar ? connectDragSource(aktivitetsKort) : aktivitetsKort;
}

AktivitetsKort.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    isDragging: PT.bool.isRequired,
    connectDragSource: PT.func.isRequired
};

const mapStateToProps = (state, props) => {
    const dialoger = state.data.dialog.data;
    const dialog = dialoger.find((d) => d.aktivitetId === props.aktivitet.id);
    const antallUlesteHenvendelser = dialog ? dialog.henvendelser.filter((h) => !h.lest).length : 0;
    return ({
        antallUlesteHenvendelser
    });
};

const mapDispatchToProps = () => ({});

export default DragSource('AktivitetsKort', dndSpec, collect)(connect(mapStateToProps, mapDispatchToProps)(AktivitetsKort));
