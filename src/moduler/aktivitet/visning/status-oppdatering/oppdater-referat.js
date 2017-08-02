import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import Tekstomrade from 'nav-frontend-tekstomrade';
import classNames from 'classnames';
import Knapp from 'nav-frontend-knapper/src/knapp';
import { Hovedknapp } from 'nav-frontend-knapper';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import { selectErVeileder } from '../../../../felles-komponenter/identitet/identitet-selector';
import hiddenIf, {
    div as HiddenIfDiv,
    section as HiddenIfSection,
} from '../../../../felles-komponenter/hidden-if/hidden-if';
import OppdaterReferatForm from './oppdater-referat-form';
import {
    publiserReferat,
    selectReferatReducer,
} from '../../aktivitet-referat-reducer';
import { autobind } from '../../../../utils';
import { STATUS } from '../../../../ducks/utils';

const HideableTekstomrade = hiddenIf(Tekstomrade);

function OppdaterReferatPure({
    className,
    aktivitet,
    referat,
    erVeileder,
    visOppdaterReferatForm,
    dispatchPubliserReferat,
    publiserer,
    erReferatPublisert,
    startOppdaterReferat,
    stoppOppdaterReferat,
}) {
    return (
        <div className={classNames('oppdater-referat', className)}>
            <Undertittel>
                <FormattedMessage id="referat.header" />
            </Undertittel>
            <HideableTekstomrade
                className="oppdater-referat__referat"
                hidden={visOppdaterReferatForm}
            >
                {referat}
            </HideableTekstomrade>
            <HiddenIfDiv hidden={!erVeileder}>
                <HiddenIfDiv hidden={visOppdaterReferatForm}>
                    <Hovedknapp
                        onClick={dispatchPubliserReferat}
                        spinner={publiserer}
                        disabled={erReferatPublisert}
                    >
                        <FormattedMessage id="referat.publiser" />
                    </Hovedknapp>
                    <Knapp onClick={startOppdaterReferat}>
                        <FormattedMessage id="referat.oppdater" />
                    </Knapp>
                </HiddenIfDiv>

                <OppdaterReferatForm
                    aktivitet={aktivitet}
                    hidden={!visOppdaterReferatForm}
                    onFerdig={stoppOppdaterReferat}
                />
            </HiddenIfDiv>
        </div>
    );
}

OppdaterReferatPure.propTypes = {
    className: PT.string,
    referat: PT.string,
    aktivitet: AppPT.aktivitet.isRequired,
    erVeileder: PT.bool.isRequired,
    visOppdaterReferatForm: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    publiserer: PT.bool.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    startOppdaterReferat: PT.func.isRequired,
    stoppOppdaterReferat: PT.func.isRequired,
};

OppdaterReferatPure.defaultProps = {
    className: undefined,
    referat: undefined,
};

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
        const { kanHaReferat, visReferat, harReferat, erVeileder } = props;

        const state = this.state || {};
        const visOppdaterReferatForm =
            state.oppdaterReferat || (erVeileder && !harReferat);

        return (
            <HiddenIfSection hidden={!kanHaReferat || !visReferat}>
                <OppdaterReferatPure
                    {...props}
                    visOppdaterReferatForm={visOppdaterReferatForm}
                    startOppdaterReferat={this.startOppdaterReferat}
                    stoppOppdaterReferat={this.stoppOppdaterReferat}
                />
                <hr className="aktivitetvisning__delelinje" />
            </HiddenIfSection>
        );
    }
}

OppdaterReferatContainer.defaultProps = {
    className: undefined,
};

OppdaterReferatContainer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    erReferatPublisert: PT.bool.isRequired,
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
