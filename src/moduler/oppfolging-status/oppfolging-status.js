import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { hentOppfolging } from './oppfolging-reducer';
import { hentIdentitet } from '../identitet/identitet-reducer';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../ducks/utils';

import {
    selectBrukerHarAvslatt,
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectOppfolgingStatus,
    selectVilkarMaBesvares,
} from './oppfolging-selector';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from '../identitet/identitet-selector';
import {
    selectFeatureData,
    selectFeatureStatus,
} from '../../felles-komponenter/feature/feature-selector';
import {
    BRUKERVILKAR,
    harFeature,
} from '../../felles-komponenter/feature/feature';
import {
    hentLest,
    selectLestInformasjon,
    selectLestStatus,
} from '../lest/lest-reducer';
import VidereSendBrukereEllerRenderChildren from './videre-send-bruker-eller-render-children';
import { INFORMASJON_MODAL_VERSJON } from '../informasjon/informasjon-modal';

class OppfolgingStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
        this.props.doHentOppfolging();
        this.props.doHentLest();
    }

    render() {
        const props = this.props;

        const videreSendTilInfo =
            props.lestStatus === STATUS.OK &&
            (!props.lestInfo ||
                props.lestInfo.verdi !== INFORMASJON_MODAL_VERSJON);

        return (
            <Innholdslaster
                avhengigheter={[
                    props.oppfolgingStatus,
                    props.identitetStatus,
                    props.toggleStatus,
                ]}
            >
                <div className="fullbredde">
                    <VidereSendBrukereEllerRenderChildren
                        videreSendTilInfo={videreSendTilInfo}
                        {...props}
                    />
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
    lestStatus: AppPT.status.isRequired,
    doHentOppfolging: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
    doHentLest: PT.func.isRequired,
    vilkarToggletAv: PT.bool.isRequired,
    lestInfo: AppPT.lest,
};

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
    underOppfolging: selectErUnderOppfolging(state),
    brukerHarAvslatt: selectBrukerHarAvslatt(state),
    manuell: selectErBrukerManuell(state),
    vilkarMaBesvares: selectVilkarMaBesvares(state),
    oppfolgingStatus: selectOppfolgingStatus(state),
    identitetStatus: selectIdentitetStatus(state),
    vilkarToggletAv: harFeature(BRUKERVILKAR, selectFeatureData(state)),
    toggleStatus: selectFeatureStatus(state),
    lestStatus: selectLestStatus(state),
    lestInfo: selectLestInformasjon(state),
});

const mapDispatchToProps = dispatch => ({
    doHentOppfolging: () => dispatch(hentOppfolging()),
    doHentIdentitet: () => dispatch(hentIdentitet()),
    doHentLest: () => dispatch(hentLest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
