import PT from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectFeatureStatus } from '../../felles-komponenter/feature/feature-selector';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';
import { hentIdentitet } from '../identitet/identitet-reducer';
import { selectErVeileder, selectIdentitetId, selectIdentitetStatus } from '../identitet/identitet-selector';
import { hentOppfolging } from './oppfolging-reducer';
import {
    selectAktorId,
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectOppfolgingStatus,
    selectOppfolgingsPerioder,
    selectReservasjonKRR,
    selectServicegruppe,
} from './oppfolging-selector';
import VidereSendBrukereEllerRenderChildren from './videre-send-bruker-eller-render-children';

class OppfolgingStatus extends Component {
    componentDidMount() {
        const { doHentIdentitet, doHentOppfolging } = this.props;
        doHentIdentitet();
        doHentOppfolging();
    }

    render() {
        const { props } = this;
        return (
            <Innholdslaster avhengigheter={[props.oppfolgingStatus, props.identitetStatus, props.toggleStatus]}>
                <div className="fullbredde">
                    <VidereSendBrukereEllerRenderChildren {...props} />
                </div>
            </Innholdslaster>
        );
    }
}

OppfolgingStatus.propTypes = {
    oppfolgingStatus: AppPT.status.isRequired,
    identitetStatus: AppPT.status.isRequired,
    toggleStatus: AppPT.status.isRequired,
    doHentOppfolging: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
    sevicegruppe: PT.string,
};

OppfolgingStatus.defaultProps = {
    sevicegruppe: null,
};

const mapStateToProps = (state) => ({
    oppfolgingStatus: selectOppfolgingStatus(state),
    identitetStatus: selectIdentitetStatus(state),
    toggleStatus: selectFeatureStatus(state),
    // for children
    erVeileder: selectErVeileder(state),
    underOppfolging: selectErUnderOppfolging(state),
    oppfolgingsPerioder: selectOppfolgingsPerioder(state),
    manuell: selectErBrukerManuell(state),
    reservasjonKRR: selectReservasjonKRR(state),
    servicegruppe: selectServicegruppe(state),
    aktorId: selectAktorId(state),
    ident: selectIdentitetId(state),
});

const mapDispatchToProps = (dispatch) => ({
    doHentOppfolging: () => dispatch(hentOppfolging()),
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
