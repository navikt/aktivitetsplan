import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { hentVilkar } from './vilkar-reducer';
import { STATUS } from '../../ducks/utils';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VilkarInnhold from './vilkar-innhold';
import GodkjennVilkarForm from './godkjenn-vilkar-form';
import { hr as HiddenIfHr } from '../../felles-komponenter/hidden-if/hidden-if';

class GodkjennVilkar extends Component {
    componentDidMount() {
        if (this.props.vilkarReducer.status === STATUS.NOT_STARTED) {
            this.props.doHentVilkar();
        }
    }

    render() {
        const { visVilkar, vilkar, vilkarReducer } = this.props;

        return (
            <div className="vilkar">
                <VilkarInnhold vilkar={vilkar} hidden={!visVilkar} />
                <HiddenIfHr className="vilkar__delelinje" hidden={!visVilkar} />
                <Innholdslaster avhengigheter={[vilkarReducer]}>
                    <div className="vilkar__godkjenning">
                        <GodkjennVilkarForm
                            visVilkar={visVilkar}
                            hash={vilkar.hash}
                        />
                    </div>
                </Innholdslaster>
            </div>
        );
    }
}

GodkjennVilkar.propTypes = {
    doHentVilkar: PT.func.isRequired,
    vilkar: AppPT.vilkar.isRequired,
    vilkarReducer: AppPT.reducer.isRequired,
    visVilkar: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    vilkarReducer: state.data.vilkar,
    vilkar: state.data.vilkar.data,
});

const mapDispatchToProps = dispatch => ({
    doHentVilkar: () => hentVilkar()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GodkjennVilkar);
