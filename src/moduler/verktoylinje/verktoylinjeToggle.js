import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Verktoylinje from '../../moduler/verktoylinje/verktoylinje';
import VerktoylinjeOriginal from '../../moduler/verktoylinje/verktoylinje-original';
import NavigasjonslinjeOriginal from '../../hovedside/navigasjonslinje/navigasjonslinje-original';
import {
    harFeature,
    VERKTOYLINJE,
} from '../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../felles-komponenter/feature/feature-selector';

function VerktoylinjeToggle({ harNyVerktoylinje }) {
    return (
        <div>
            {harNyVerktoylinje
                ? <Verktoylinje />
                : <div>
                      <NavigasjonslinjeOriginal />
                      <VerktoylinjeOriginal />
                  </div>}
        </div>
    );
}

VerktoylinjeToggle.propTypes = {
    harNyVerktoylinje: PT.bool.isRequired,
};

const mapStateToProps = state => {
    const harNyVerktoylinje = harFeature(
        VERKTOYLINJE,
        selectFeatureData(state)
    );
    return {
        harNyVerktoylinje,
    };
};

export default connect(mapStateToProps)(VerktoylinjeToggle);
