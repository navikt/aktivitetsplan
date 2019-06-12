import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import Maal from '../maal/maal';
import MittMaal from '../maalLinje/mitt-maal';
import {
    harFeature,
    NYHOVEDMAAL,
} from '../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';

function FeatureToggleMaal({ visNyHovedmaal }) {
    return visNyHovedmaal ? <Maal /> : <MittMaal />;
}

const mapStateToProps = state => {
    const visNyHovedmaal = harFeature(NYHOVEDMAAL, selectFeatureData(state));
    return {
        visNyHovedmaal,
    };
};

FeatureToggleMaal.propTypes = {
    visNyHovedmaal: PT.bool,
};

FeatureToggleMaal.defaultProps = {
    visNyHovedmaal: false,
};

export default connect(mapStateToProps, null)(FeatureToggleMaal);
