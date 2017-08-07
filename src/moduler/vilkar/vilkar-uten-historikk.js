import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as AppPT from '../../proptypes';
import VilkarModal from './vilkar-modal';
import Vilkar from './vilkar';
import { hentHistoriskeVilkar } from './historiske-vilkar';
import {
    selectHistoriskeVilkarReducer,
    selectHistoriskVilkarMedGuid,
} from './historiske-vilkar-selector';
import { STATUS } from '../../ducks/utils';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectRouteParams } from '../../routing';

class VilkarUtenHistorikkStoreConnector extends Component {
    componentDidMount() {
        const { historiskeVilkarReducer, doHentHistoriskeVilkar } = this.props;
        if (historiskeVilkarReducer.status === STATUS.NOT_STARTED) {
            doHentHistoriskeVilkar();
        }
    }

    render() {
        const { historiskeVilkarReducer, vilkar } = this.props;
        return (
            <Innholdslaster avhengigheter={[historiskeVilkarReducer]}>
                <Vilkar vilkarListe={[vilkar]} />
            </Innholdslaster>
        );
    }
}

VilkarUtenHistorikkStoreConnector.propTypes = {
    doHentHistoriskeVilkar: PT.func.isRequired,
    historiskeVilkarReducer: AppPT.reducer.isRequired,
    vilkar: AppPT.vilkar.isRequired,
};

const mapStateToProps = (state, props) => ({
    historiskeVilkarReducer: selectHistoriskeVilkarReducer(state),
    vilkar: selectHistoriskVilkarMedGuid(state, selectRouteParams(props).key),
});

const mapDispatchToProps = dispatch => ({
    doHentHistoriskeVilkar: () => dispatch(hentHistoriskeVilkar()),
});

export default VilkarModal(
    connect(mapStateToProps, mapDispatchToProps)(
        withRouter(VilkarUtenHistorikkStoreConnector)
    ),
    {
        visTilbakeKnapp: true,
    }
);
