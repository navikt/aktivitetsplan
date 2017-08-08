import { connect } from 'react-redux';
import PT from 'prop-types';
import { selectAlleFeilmeldinger } from './feilmelding-selector';
import { mapTyperTilAlertstripe } from './feilmelding-utils';

function Feilmelding({ feilmeldinger }) {
    return mapTyperTilAlertstripe(feilmeldinger);
}

Feilmelding.defaultProps = {
    feilmeldinger: [],
};

Feilmelding.propTypes = {
    feilmeldinger: PT.array,
};

const mapStateToProps = state => ({
    feilmeldinger: selectAlleFeilmeldinger(state),
});

export default connect(mapStateToProps)(Feilmelding);
