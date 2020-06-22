import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import AktiviteskortPeriodeVisning from './aktivitetskort-periode';
import InternLenke from '../../../felles-komponenter/utils/internLenke';
import * as AppPT from '../../../proptypes';
import {
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    SAMTALEREFERAT_TYPE,
    MOTE_TYPE
} from '../../../constant';
import { selectErBruker, selectIdentitetSlice } from '../../identitet/identitet-selector';
import { selectLestAktivitetsplan, selectLestStatus } from '../../lest/lest-reducer';
import { selectAktiviteterSomHarBlittVist, settAktivitetSomVist } from '../aktivitetview-reducer';
import { erNyEndringIAktivitet } from '../aktivitet-util';
import { selectErUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';
import { STATUS } from '../../../ducks/utils';
import SokeAvtaleAntall from './SokeAvtaleAntall';
import Arbeidsgiver from './Stilling';
import AktivitetType from './AktivitetType';
import Aktivitetskorttittel from './AktivitetKortTitel';
import { aktivitetRoute } from '../../../routes';
import DialogIkon from "../visning/underelement-for-aktivitet/dialog/DialogIkon";
import {selectDialogForAktivitetId} from "../../dialog/dialog-selector";

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

class AktivitetsKort extends Component {
    render() {
        const {
            aktivitet,
            isDragging,
            connectDragSource,
            erFlyttbar,
            doSettAktivitetMedEndringerSomVist,
            harEndringerIAktivitet,
            antallUlesteHenvendelser
        } = this.props;
        const { id, type } = aktivitet;

        const ariaLabel = `aktivitetskort__header__${id} aktivitetskort__dato__${id}`;

        const aktivitetsKort = (
            <div>
                <InternLenke
                    id={`aktivitetskort-${aktivitet.id}`}
                    href={aktivitetRoute(id)}
                    draggable={erFlyttbar}
                    className={classNames('aktivitetskort', {
                        'aktivitetskort--flyttbar': erFlyttbar,
                        'aktivitetskort--drag': isDragging
                    })}
                    onClick={() => doSettAktivitetMedEndringerSomVist(aktivitet)}
                    skipLenkeStyling
                >
                    <article aria-labelledby={ariaLabel}>
                        <AktivitetType type={type} />
                        <Aktivitetskorttittel
                            aktivitet={aktivitet}
                            harEndringerIAktivitet={harEndringerIAktivitet}
                            isDragging={isDragging}
                        />
                        <Arbeidsgiver aktivitet={aktivitet} />
                        <AktiviteskortPeriodeVisning aktivitet={aktivitet} />
                        <SokeAvtaleAntall aktivitet={aktivitet} />
                        <div className="aktivitetskort--dialogikon">
                            <DialogIkon antallUleste={antallUlesteHenvendelser} />
                        </div>
                    </article>
                </InternLenke>
            </div>
        );

        return erFlyttbar ? connectDragSource(aktivitetsKort) : aktivitetsKort;
    }
}

function sjekkErFlyttbar(aktivitet, erBruker) {
    const { type, status, nesteStatus, historisk } = aktivitet;
    const erArenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(type);
    const erFerdig = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const brukerKanOppdater = [SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker;
    return !nesteStatus && !historisk && !erFerdig && !erArenaAktivitet && !brukerKanOppdater;
}

AktivitetsKort.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    isDragging: PT.bool.isRequired,
    connectDragSource: PT.func.isRequired,
    erFlyttbar: PT.bool.isRequired,
    doSettAktivitetMedEndringerSomVist: PT.func.isRequired,
    harEndringerIAktivitet: PT.bool
};

AktivitetsKort.defaultProps = {
    harEndringerIAktivitet: false
};

const dragbartAktivitetskort = DragSource('AktivitetsKort', dndSpec, collect)(AktivitetsKort);

const mapStateToProps = (state, props) => {
    const { aktivitet } = props;
    const lest = selectLestAktivitetsplan(state);
    const lestStatus = selectLestStatus(state);
    const aktiviteterSomHarBlittVist = selectAktiviteterSomHarBlittVist(state);
    const aktivitetHarIkkeBlittVist = !aktiviteterSomHarBlittVist.find(
        aktivitet => aktivitet.id === props.aktivitet.id
    );

    const dialog = selectDialogForAktivitetId(state, aktivitet.id);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const antallUlesteHenvendelser = henvendelser
        .filter(henvendelse => !henvendelse.lest)
        .length;

    const me = selectIdentitetSlice(state).data;

    const harEndringerIAktivitet =
        lestStatus === STATUS.OK && erNyEndringIAktivitet(props.aktivitet, lest, me) && aktivitetHarIkkeBlittVist;
    return {
        erFlyttbar: sjekkErFlyttbar(props.aktivitet, selectErBruker(state)) && selectErUnderOppfolging(state),
        harEndringerIAktivitet,
        antallUlesteHenvendelser
    };
};

const mapDispatchToProps = dispatch => ({
    doSettAktivitetMedEndringerSomVist: aktivitet => dispatch(settAktivitetSomVist(aktivitet))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(dragbartAktivitetskort);
