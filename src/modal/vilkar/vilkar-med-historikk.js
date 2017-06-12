import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as AppPT from '../../proptypes';
import Vilkar from './vilkar';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { hentHistoriskeVilkar } from '../../ducks/historiske-vilkar';
import VilkarModal from './vilkar-modal';
import { STATUS } from '../../ducks/utils';

class VilkarMedHistorikkStoreConnector extends Component {
    componentDidMount() {
        if (this.props.historiskeVilkar.status === STATUS.NOT_STARTED) {
            this.props.doHentHistoriskeVilkar();
        }
    }

    render() {
        const { historiskeVilkar } = this.props;
        return (
            <Innholdslaster avhengigheter={[historiskeVilkar]}>
                <Vilkar
                    vilkarListe={historiskeVilkar.data}
                    visHistorikk={historiskeVilkar.data.length > 1}
                />
            </Innholdslaster>
        );
    }
}

VilkarMedHistorikkStoreConnector.propTypes = {
    doHentHistoriskeVilkar: PT.func.isRequired,
    historiskeVilkar: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.vilkar),
    }).isRequired,
};

const mapStateToProps = state => ({
    historiskeVilkar: state.data.historiskeVilkar,
});

const mapDispatchToProps = dispatch => ({
    doHentHistoriskeVilkar: () => dispatch(hentHistoriskeVilkar()),
});

export default VilkarModal(
    connect(mapStateToProps, mapDispatchToProps)(
        VilkarMedHistorikkStoreConnector
    )
);
