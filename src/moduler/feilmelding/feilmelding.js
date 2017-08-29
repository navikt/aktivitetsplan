import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import classNames from 'classnames';
import { selectAlleFeilmeldinger } from './feilmelding-selector';
import { mapTyperTilAlertstripe } from './feilmelding-utils';
import Feil from '../../sider/hovedside/feil/feil';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';

function Detaljer({ feilId, detaljertType, feilMelding, stackTrace }) {
    return (
        <div>
            <div>
                {feilId}
            </div>
            <div>
                {detaljertType}
            </div>
            <h2>
                {feilMelding}
            </h2>
            <pre>
                {stackTrace}
            </pre>
        </div>
    );
}

Detaljer.defaultProps = {
    feilId: null,
    detaljertType: null,
    feilMelding: null,
    stackTrace: null,
};

Detaljer.propTypes = {
    feilId: PT.string,
    detaljertType: PT.string,
    feilMelding: PT.string,
    stackTrace: PT.string,
};

class Feilmelding extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        }
    }

    toggleDetaljer = () => {
        this.setState({
            apen: !this.state.apen,
        })
    };

    render() {
        const { feilmeldinger, className } = this.props;
        const feil = feilmeldinger[0];
        const detaljer = feil && feil.detaljer;
        return (
            <VisibleIfDiv
                visible={feilmeldinger.length > 0}
                className={classNames(className, 'feilmelding')}
            >
                <div className="feil-container">
                    <Feil />
                </div>
                {mapTyperTilAlertstripe(feilmeldinger)}
                <VisibleIfDiv
                    visible={!!feil && !!feil.detaljer}
                    className="feil__detaljer"
                >
                    <Knappelenke
                        onClick={this.toggleDetaljer}
                        className=""
                    >
                        Vis detaljer
                    </Knappelenke>
                    {this.state.apen && feilmeldinger.map((feilen) => <Detaljer key={feilen.id} feilId={feilen.id} {...feilen.detaljer} />) }
                </VisibleIfDiv>

            </VisibleIfDiv>
        );
    }
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
