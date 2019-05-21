import React, {Component} from 'react';
import Maal from '../maal/maal';
import MittMaal from '../maalLinje/mitt-maal';
import {connect} from "react-redux";
import {harFeature, NYHOVEDMAAL} from "../../felles-komponenter/feature/feature";
import {selectFeatureData} from "../../felles-komponenter/feature/feature-selector";
import PT from "prop-types";

class FeatureToggleMaal extends Component {
    render() {
        const { visNyHovedmaal } = this.props;
        return visNyHovedmaal ? <Maal/> : <MittMaal/>
    }
}

const mapStateToProps = (state) => {
    const visNyHovedmaal = harFeature(
        NYHOVEDMAAL,
        selectFeatureData(state)
    );
    return {
        visNyHovedmaal
    }
};

FeatureToggleMaal.propTypes = {
    visNyHovedmaal: PT.bool,
};

FeatureToggleMaal.defaultProps = {
    visNyHovedmaal: false,
};

export default connect(mapStateToProps, null)(FeatureToggleMaal);
