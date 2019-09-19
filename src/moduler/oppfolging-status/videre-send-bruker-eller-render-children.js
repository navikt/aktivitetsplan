import React, { Component } from 'react';
import PT from 'prop-types';
import shajs from 'sha.js';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';
import * as AppPT from '../../proptypes';
import HarIkkeAktivitetsplan from './har-ikke-aktivitetsplan';
import loggEvent, {
    LOGGING_ANTALLBRUKERE,
} from '../../felles-komponenter/utils/logging';

function hash(string) {
    return string ? shajs('sha256').update(string).digest('hex') : null;
}

function loggingAntallBrukere(
    erVeileder,
    servicegruppe,
    underOppfolging,
    ident,
    aktorId
) {
    const hashetAktorID = hash(aktorId);
    const veileder = erVeileder && hash(ident);
    const bruker =
        erVeileder || underOppfolging ? hashetAktorID : 'IKKE_UNDER_OPPFOLGING';

    if (erVeileder !== undefined && erVeileder !== null) {
        loggEvent(
            LOGGING_ANTALLBRUKERE,
            {
                erVeileder,
                underOppfolging,
                veileder,
                bruker,
            },
            {
                servicegruppe,
            }
        );
    }
}

class VidereSendBrukereEllerRenderChildren extends Component {
    componentDidMount() {
        const {
            erVeileder,
            servicegruppe,
            underOppfolging,
            ident,
            aktorId,
        } = this.props;

        loggingAntallBrukere(
            erVeileder,
            servicegruppe,
            underOppfolging,
            ident,
            aktorId
        );
    }

    render() {
        const {
            children,
            erVeileder,
            manuell,
            underOppfolging,
            oppfolgingsPerioder,
        } = this.props;

        if (!underOppfolging && oppfolgingsPerioder.length === 0) {
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
    servicegruppe: null,
    ident: null,
    aktorId: null,
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
    servicegruppe: PT.string,
    ident: PT.string,
    aktorId: PT.string,
};

export default VidereSendBrukereEllerRenderChildren;
