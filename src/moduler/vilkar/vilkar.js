import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { hentVilkar } from '../../ducks/vilkar';
import { STATUS } from '../../ducks/utils';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VilkarInnhold from '../../modal/vilkar/vilkar-innhold';
import GodkjennVilkar from './godkjenn-vilkar';

class Vilkar extends Component {
    componentDidMount() {
        if (this.props.vilkarReducer.status === STATUS.NOT_STARTED) {
            this.props.doHentVilkar();
        }
    }

    render() {
        const { visGodkjenning, visVilkar, vilkar, vilkarReducer } = this.props;

        return (
            <div className="vilkar">

                {visVilkar && <VilkarInnhold vilkar={vilkar} />}

                {visVilkar &&
                    visGodkjenning &&
                    <hr className="vilkar__delelinje" />}

                {visGodkjenning &&
                    <Innholdslaster avhengigheter={[vilkarReducer]}>
                        <div className="vilkar__godkjenning">
                            <GodkjennVilkar
                                visVilkar={visVilkar}
                                hash={vilkar.hash}
                            />
                        </div>
                    </Innholdslaster>}
            </div>
        );
    }
}

Vilkar.propTypes = {
    doHentVilkar: PT.func.isRequired,
    vilkar: AppPT.vilkar.isRequired,
    vilkarReducer: AppPT.reducer.isRequired,
    visGodkjenning: PT.bool.isRequired,
    visVilkar: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    vilkarReducer: state.data.vilkar,
    vilkar: state.data.vilkar.data,
});

const mapDispatchToProps = dispatch => ({
    doHentVilkar: () => hentVilkar()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Vilkar);
