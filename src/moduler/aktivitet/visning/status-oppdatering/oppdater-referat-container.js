import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import {
    section as HiddenIfSection,
    hr as HiddenIfHr,
} from '../../../../felles-komponenter/hidden-if/hidden-if';
import OppdaterReferat from './oppdater-referat';
import {
    publiserReferat,
    selectReferatReducer,
} from '../../aktivitet-referat-reducer';
import { autobind } from '../../../../utils';
import { STATUS } from '../../../../ducks/utils';

class OppdaterReferatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        autobind(this);
    }

    startOppdaterReferat() {
        this.setState({
            oppdaterReferat: true,
        });
    }

    stoppOppdaterReferat() {
        this.setState({
            oppdaterReferat: false,
        });
    }

    render() {
        const props = this.props;
        const {
            kanHaReferat,
            visReferat,
            harReferat,
            erVeileder,
            delelinje,
        } = props;

        const state = this.state || {};
        const visOppdaterReferatForm =
            state.oppdaterReferat || (erVeileder && !harReferat);

        return (
            <HiddenIfSection hidden={!kanHaReferat || !visReferat}>
                <OppdaterReferat
                    {...props}
                    visOppdaterReferatForm={visOppdaterReferatForm}
                    startOppdaterReferat={this.startOppdaterReferat}
                    stoppOppdaterReferat={this.stoppOppdaterReferat}
                />
                <HiddenIfHr
                    hidden={!delelinje}
                    className="aktivitetvisning__delelinje"
                />
            </HiddenIfSection>
        );
    }
}

OppdaterReferatContainer.defaultProps = {
    className: undefined,
    delelinje: false,
};

OppdaterReferatContainer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    delelinje: PT.bool,
    erVeileder: PT.bool.isRequired,
    publiserer: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    className: PT.string,
};

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet;
    const erReferatPublisert = aktivitet.erReferatPublisert;
    const aktivitetType = aktivitet.type;
    const kanHaReferat =
        (aktivitetType === MOTE_TYPE &&
            aktivitet.fraDato < moment().toISOString()) ||
        aktivitetType === SAMTALEREFERAT_TYPE;

    const referat = aktivitet.referat;
    const harReferat = !!referat;

    const erVeileder = selectErVeileder(state);
    const visReferat = erVeileder || erReferatPublisert;

    return {
        publiserer: selectReferatReducer(state).status === STATUS.PENDING,
        erVeileder,
        erReferatPublisert,
        kanHaReferat,
        visReferat,
        referat,
        harReferat,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    dispatchPubliserReferat: () =>
        dispatch(publiserReferat(ownProps.aktivitet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    OppdaterReferatContainer
);
