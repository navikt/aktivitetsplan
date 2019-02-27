import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { hentOppfolging } from './oppfolging-reducer';
import { hentIdentitet } from '../identitet/identitet-reducer';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';

import {
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectOppfolgingsPerioder,
    selectOppfolgingStatus,
} from './oppfolging-selector';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';
import { selectFeatureStatus } from '../../felles-komponenter/feature/feature-selector';
import VidereSendBrukereEllerRenderChildren from './videre-send-bruker-eller-render-children';

class OppfolgingStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
        this.props.doHentOppfolging();
    }

    render() {
        const props = this.props;
        return (
            <Innholdslaster
                avhengigheter={[
                    props.oppfolgingStatus,
                    props.identitetStatus,
                    props.toggleStatus,
                ]}
            >
                <div className="fullbredde">
                    <VidereSendBrukereEllerRenderChildren {...props} />
                </div>
            </Innholdslaster>
        );
    }
}

OppfolgingStatus.defaultProps = {
    lestInfo: null,
};

OppfolgingStatus.propTypes = {
    oppfolgingStatus: AppPT.status.isRequired,
    identitetStatus: AppPT.status.isRequired,
    toggleStatus: AppPT.status.isRequired,
    doHentOppfolging: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
};

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
    underOppfolging: selectErUnderOppfolging(state),
    oppfolgingsPerioder: selectOppfolgingsPerioder(state),
    manuell: selectErBrukerManuell(state),
    oppfolgingStatus: selectOppfolgingStatus(state),
    identitetStatus: selectIdentitetStatus(state),
    toggleStatus: selectFeatureStatus(state),
});

const mapDispatchToProps = dispatch => ({
    doHentOppfolging: () => dispatch(hentOppfolging()),
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
