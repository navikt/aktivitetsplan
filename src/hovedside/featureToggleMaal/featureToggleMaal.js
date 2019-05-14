import React, {Component} from 'react';
import Maal from '../maal/maal';
import {connect} from "react-redux";
import {harFeature, NYENDRINGIAKTIVITET} from "../../felles-komponenter/feature/feature";
import {selectFeatureData} from "../../felles-komponenter/feature/feature-selector";
import PT from "prop-types";

class FeatureToggleMaal extends Component {
    render() {
        const { harNyEndringIAktitetFeature } = this.props;
        console.log('props.harNyEndringIAktitetFeature', harNyEndringIAktitetFeature); // tslint:disable-line
        return (
            <Maal/>
        )
    }
}

const mapStateToProps = (state) => {
    const harNyEndringIAktitetFeature = harFeature(
        NYENDRINGIAKTIVITET,
        selectFeatureData(state)
    );
    return {
        harNyEndringIAktitetFeature
    }
};

FeatureToggleMaal.propTypes = {
    harNyEndringIAktitetFeature: PT.bool,
};

FeatureToggleMaal.defaultProps = {
    harNyEndringIAktitetFeature: false,
};

export default connect(mapStateToProps, null)(FeatureToggleMaal);
