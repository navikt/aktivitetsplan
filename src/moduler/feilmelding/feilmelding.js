import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import classNames from 'classnames';
import { selectAlleFeilmeldinger } from './feilmelding-selector';
import { mapTyperTilAlertstripe } from './feilmelding-utils';
import Feil from '../../sider/hovedside/feil/feil';

function Feilmelding({ feilmeldinger, className }) {
    return (
        <div className={classNames(className, 'feilmelding')}>
            <Feil />
            {mapTyperTilAlertstripe(feilmeldinger)}
        </div>
    );
}

Feilmelding.defaultProps = {
    feilmeldinger: [],
    className: undefined,
};

Feilmelding.propTypes = {
    feilmeldinger: PT.array,
    className: PT.string,
};

const mapStateToProps = state => ({
    feilmeldinger: selectAlleFeilmeldinger(state),
});

export default connect(mapStateToProps)(Feilmelding);
