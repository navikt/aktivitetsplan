import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../../constant';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import { section as HiddenIfSection } from '../../../../felles-komponenter/hidden-if/hidden-if';
import ReferatSeksjon from './referat-seksjon';
import { publiserReferat } from '../../aktivitet-actions';
import { autobind } from '../../../../utils';
import { STATUS } from '../../../../ducks/utils';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import DeleLinje from '../delelinje/delelinje';
import { selectUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import moment from 'moment';

class ReferatContainer extends Component {
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
        const { kanHaReferat, visReferat, harReferat, erVeileder } = this.props;

        const { oppdaterReferat } = this.state;
        const visOppdaterReferatForm = oppdaterReferat || (erVeileder && !harReferat);

        return (
            <HiddenIfSection hidden={!kanHaReferat || !visReferat}>
                <ReferatSeksjon
                    {...this.props}
                    visOppdaterReferatForm={visOppdaterReferatForm}
                    startOppdaterReferat={this.startOppdaterReferat}
                    stoppOppdaterReferat={this.stoppOppdaterReferat}
                />
                <DeleLinje />
            </HiddenIfSection>
        );
    }
}

ReferatContainer.defaultProps = {
    className: undefined,
    erReferatPublisert: false,
};

ReferatContainer.propTypes = {
    aktivitet: PT.object.isRequired,
    className: PT.string,
};

const mapStateToProps = (state, props) => {
    const { aktivitet } = props;
    const { erReferatPublisert } = aktivitet;
    const aktivitetType = aktivitet.type;
    const kanHaReferat =
        (aktivitetType === MOTE_TYPE && moment(aktivitet.fraDato).toISOString() < moment().toISOString()) ||
        aktivitetType === SAMTALEREFERAT_TYPE;

    const { referat } = aktivitet;
    const harReferat = !!referat;

    const erVeileder = selectErVeileder(state);
    const underOppfolging = selectUnderOppfolging(state);
    const visReferat =
        (erVeileder || erReferatPublisert) && (harReferat || !aktivitet.historisk) && (harReferat || underOppfolging);

    return {
        publiserer: selectAktivitetStatus(state) === (STATUS.PENDING || STATUS.RELOADING),
        underOppfolging,
        erVeileder,
        erReferatPublisert,
        kanHaReferat,
        visReferat,
        referat,
        harReferat,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    dispatchPubliserReferat: () => dispatch(publiserReferat(ownProps.aktivitet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferatContainer);
