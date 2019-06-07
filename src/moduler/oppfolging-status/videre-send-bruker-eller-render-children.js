import React, { Component } from 'react';
import PT from 'prop-types';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';
import * as AppPT from '../../proptypes';
import HarIkkeAktivitetsplan from './har-ikke-aktivitetsplan';
import loggEvent from '../../felles-komponenter/utils/logging';

const LOGGING_ANTALLBRUKERE = 'aktivitetsplan.antallBrukere';

function loggingAntallBrukere(typeEvent, hvem) {
    const { erVeileder } = hvem;
    if (erVeileder !== undefined && erVeileder !== null) {
        loggEvent(typeEvent, hvem);
    }
}

class VidereSendBrukereEllerRenderChildren extends Component {
    componentDidMount() {
        const { erVeileder } = this.props;
        loggingAntallBrukere(LOGGING_ANTALLBRUKERE, { erVeileder });
    }

    render() {
        const {
            children,
            erVeileder,
            manuell,
            underOppfolging,
            oppfolgingsPerioder,
        } = this.props;

        if (
            !underOppfolging &&
            oppfolgingsPerioder.length === 0
        ) {
            return <HarIkkeAktivitetsplan erVeileder={erVeileder} />;
        }

        if (!erVeileder && manuell) {
            return <AktiverDigitalOppfolging />;
        }

        return (
            <div>
                {children}
            </div>
        );
    }
}

VidereSendBrukereEllerRenderChildren.defaultProps = {
    children: null,
    erVeileder: null,
    manuell: null,
    underOppfolging: false,
    kanStarteOppfolging: false,
    oppfolgingsPerioder: [],
    reservasjonKRR: null,
    videreSendTilInfo: false,
};

VidereSendBrukereEllerRenderChildren.propTypes = {
    children: PT.node,
    erVeileder: PT.bool,
    manuell: PT.bool,
    underOppfolging: PT.bool,
    reservasjonKRR: PT.bool,
    videreSendTilInfo: PT.bool,
    kanStarteOppfolging: PT.bool,
    oppfolgingsPerioder: PT.arrayOf(AppPT.oppfolgingsPeriode),
};

export default VidereSendBrukereEllerRenderChildren;
