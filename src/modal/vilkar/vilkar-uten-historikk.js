import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { withRouter } from 'react-router';
import './vilkar.less';
import * as AppPT from '../../proptypes';
import VilkarModal from './vilkar-modal';
import Vilkar from './vilkar';
import { hentHistoriskeVilkar } from '../../ducks/historiske-vilkar';
import { STATUS } from '../../ducks/utils';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';

class VilkarUtenHistorikkStoreConnector extends Component {
    componentDidMount() {
        if (this.props.historiskeVilkar.status === STATUS.NOT_STARTED) {
            this.props.doHentHistoriskeVilkar();
        }
    }

    finnVilkar() {
        const key = this.props.params.key;
        return this.props.historiskeVilkar.data.find(
            vilkar => vilkar.guid === key
        );
    }

    render() {
        return (
            <Innholdslaster avhengigheter={[this.props.historiskeVilkar]}>
                <Vilkar vilkar={this.finnVilkar()} />
            </Innholdslaster>
        );
    }
}

VilkarUtenHistorikkStoreConnector.propTypes = {
    doHentHistoriskeVilkar: PT.func.isRequired,
    historiskeVilkar: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.vilkar),
    }).isRequired,
    params: PT.shape({ key: PT.string }).isRequired,
};

const mapStateToProps = state => ({
    historiskeVilkar: state.data.historiskeVilkar,
});

const mapDispatchToProps = dispatch => ({
    doHentHistoriskeVilkar: () => dispatch(hentHistoriskeVilkar()),
});

export default VilkarModal(
    connect(mapStateToProps, mapDispatchToProps)(
        withRouter(VilkarUtenHistorikkStoreConnector)
    )
);
