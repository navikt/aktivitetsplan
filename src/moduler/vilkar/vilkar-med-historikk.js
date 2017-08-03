import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as AppPT from '../../proptypes';
import Vilkar from './vilkar';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import {
    hentHistoriskeVilkar,
    selectHistoriskeVilkar,
    selectHistoriskeVilkarReducer,
} from './historiske-vilkar';
import VilkarModal from './vilkar-modal';
import { STATUS } from '../../ducks/utils';

class VilkarMedHistorikkStoreConnector extends Component {
    componentDidMount() {
        const { historiskeVilkarReducer, doHentHistoriskeVilkar } = this.props;
        if (historiskeVilkarReducer.status === STATUS.NOT_STARTED) {
            doHentHistoriskeVilkar();
        }
    }

    render() {
        const { historiskeVilkar, historiskeVilkarReducer } = this.props;
        return (
            <Innholdslaster avhengigheter={[historiskeVilkarReducer]}>
                <Vilkar
                    vilkarListe={historiskeVilkar}
                    visHistorikk={historiskeVilkar.length > 1}
                />
            </Innholdslaster>
        );
    }
}

VilkarMedHistorikkStoreConnector.propTypes = {
    doHentHistoriskeVilkar: PT.func.isRequired,
    historiskeVilkarReducer: AppPT.reducer.isRequired,
    historiskeVilkar: PT.arrayOf(AppPT.vilkar).isRequired,
};

const mapStateToProps = state => ({
    historiskeVilkarReducer: selectHistoriskeVilkarReducer(state),
    historiskeVilkar: selectHistoriskeVilkar(state),
});

const mapDispatchToProps = dispatch => ({
    doHentHistoriskeVilkar: () => dispatch(hentHistoriskeVilkar()),
});

export default VilkarModal(
    connect(mapStateToProps, mapDispatchToProps)(
        VilkarMedHistorikkStoreConnector
    )
);
