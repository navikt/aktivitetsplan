import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as AppPT from '../../proptypes';
import Vilkar from './vilkar';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { hentHistoriskeVilkar } from './historiske-vilkar';
import {
    selectHistoriskeVilkar,
    selectHistoriskeVilkarStatus,
} from './historiske-vilkar-selector';
import VilkarModal from './vilkar-modal';
import { STATUS } from '../../ducks/utils';

class VilkarMedHistorikkStoreConnector extends Component {
    componentDidMount() {
        const { historiskeVilkarStatus, doHentHistoriskeVilkar } = this.props;
        if (historiskeVilkarStatus === STATUS.NOT_STARTED) {
            doHentHistoriskeVilkar();
        }
    }

    render() {
        const { historiskeVilkar, historiskeVilkarStatus } = this.props;
        return (
            <Innholdslaster avhengigheter={[historiskeVilkarStatus]}>
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
    historiskeVilkarStatus: PT.string.isRequired,
    historiskeVilkar: PT.arrayOf(AppPT.vilkar).isRequired,
};

const mapStateToProps = state => ({
    historiskeVilkarStatus: selectHistoriskeVilkarStatus(state),
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
