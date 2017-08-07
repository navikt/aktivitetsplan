import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as AppPT from '../../proptypes';
import VilkarModal from './vilkar-modal';
import Vilkar from './vilkar';
import { hentHistoriskeVilkar } from './historiske-vilkar';
import {
    selectHistoriskeVilkarStatus,
    selectHistoriskVilkarMedGuid,
} from './historiske-vilkar-selector';
import { STATUS } from '../../ducks/utils';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectRouteParams } from '../../routing';

class VilkarUtenHistorikkStoreConnector extends Component {
    componentDidMount() {
        const { historiskeVilkarStatus, doHentHistoriskeVilkar } = this.props;
        if (historiskeVilkarStatus === STATUS.NOT_STARTED) {
            doHentHistoriskeVilkar();
        }
    }

    render() {
        const { historiskeVilkarStatus, vilkar } = this.props;
        return (
            <Innholdslaster avhengigheter={[historiskeVilkarStatus]}>
                <Vilkar vilkarListe={[vilkar]} />
            </Innholdslaster>
        );
    }
}

VilkarUtenHistorikkStoreConnector.propTypes = {
    doHentHistoriskeVilkar: PT.func.isRequired,
    historiskeVilkarStatus: AppPT.status.isRequired,
    vilkar: AppPT.vilkar.isRequired,
};

const mapStateToProps = (state, props) => ({
    historiskeVilkarStatus: selectHistoriskeVilkarStatus(state),
    vilkar: selectHistoriskVilkarMedGuid(state, selectRouteParams(props).key),
});

const mapDispatchToProps = dispatch => ({
    doHentHistoriskeVilkar: () => dispatch(hentHistoriskeVilkar()),
});

export default VilkarModal(
    withRouter(
        connect(mapStateToProps, mapDispatchToProps)(
            VilkarUtenHistorikkStoreConnector
        )
    ),
    {
        visTilbakeKnapp: true,
    }
);
