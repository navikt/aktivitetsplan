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
import { erPrivateBrukerSomSkalSkrusAv } from '../privat-modus/privat-modus-selector';
import {
    selectFeatureData,
    selectFeatureStatus,
} from '../../felles-komponenter/feature/feature-selector';
import {
    BRUKERVILKAR,
    harFeature,
} from '../../felles-komponenter/feature/feature';
import { hentLest, selectLest, selectLestStatus } from '../lest/lest-reducer';
import RenderBrukerInfo from './render-bruker-info';
import { INFORMASJON_MODAL_VERSJON } from '../informasjon/informasjon-modal';

class OppfolgingStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
        this.props.doHentOppfolging();
        this.props.doHentLest();
    }

    render() {
        const props = this.props;

        const sisteInformasjonLest = props.lestInfo.filter(
            e => e.ressurs === 'informasjon'
        )[0];

        const videreSendTilInfo =
            props.lestStatus === STATUS.OK &&
            !!sisteInformasjonLest &&
            sisteInformasjonLest.verdi !== INFORMASJON_MODAL_VERSJON;

        return (
            <Innholdslaster
                avhengigheter={[
                    props.oppfolgingStatus,
                    props.identitetStatus,
                    props.toggleStatus,
                    props.lestStatus,
                ]}
            >
                <div className="fullbredde">
                    <RenderBrukerInfo
                        videreSendTilInfo={videreSendTilInfo}
                        {...props}
                    />
                </div>
            </Innholdslaster>
        );
    }
}
OppfolgingStatus.propTypes = {
    oppfolgingStatus: AppPT.status.isRequired,
    identitetStatus: AppPT.status.isRequired,
    toggleStatus: AppPT.status.isRequired,
    lestStatus: AppPT.status.isRequired,
    doHentOppfolging: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
    doHentLest: PT.func.isRequired,
    privateModus: PT.bool.isRequired,
    vilkarToggletAv: PT.bool.isRequired,
    lestInfo: PT.arrayOf(AppPT.lest).isRequired,
};

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
    underOppfolging: selectErUnderOppfolging(state),
    brukerHarAvslatt: selectBrukerHarAvslatt(state),
    manuell: selectErBrukerManuell(state),
    vilkarMaBesvares: selectVilkarMaBesvares(state),
    oppfolgingStatus: selectOppfolgingStatus(state),
    identitetStatus: selectIdentitetStatus(state),
    privateModus: erPrivateBrukerSomSkalSkrusAv(state),
    vilkarToggletAv: harFeature(BRUKERVILKAR, selectFeatureData(state)),
    toggleStatus: selectFeatureStatus(state),
    lestStatus: selectLestStatus(state),
    lestInfo: selectLest(state),
});

const mapDispatchToProps = dispatch => ({
    doHentOppfolging: () => dispatch(hentOppfolging()),
    doHentIdentitet: () => dispatch(hentIdentitet()),
    doHentLest: () => dispatch(hentLest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppfolgingStatus);
