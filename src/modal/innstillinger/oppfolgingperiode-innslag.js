import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Dato from '../../felles-komponenter/dato';
import { hentVeileder } from './../../ducks/veileder';

class OppfolgingPeriodeInnslag extends Component {
    componentWillMount() {
        this.props.doHentVeileder(this.props.periode.veileder);
    }

    render() {
        const { veileder, begrunnelse, sluttDato } = this.props.periode;
        const veiledere = this.props.veiledere;
        return (
            <div className="oppfolgingperiode__innslag">
                <Element>
                    <FormattedMessage
                        id="innstillinger.oppfolginghistorikk.beskrivelse"
                        values={{
                            veileder: `${veiledere[veileder] || ''} (${veileder})`,
                        }}
                    />
                </Element>
                <Normaltekst>
                    <FormattedMessage
                        id="innstillinger.oppfolginghistorikk.begrunnelse"
                        values={{ begrunnelse }}
                    />
                </Normaltekst>
                <Dato>
                    {sluttDato}
                </Dato>
            </div>
        );
    }
}

OppfolgingPeriodeInnslag.defaultProps = {
    doHentVeileder: undefined,
    veiledere: {},
};

OppfolgingPeriodeInnslag.propTypes = {
    periode: PT.shape({
        veileder: PT.string,
        begrunnelse: PT.string,
        sluttDato: PT.string,
    }).isRequired,
    veiledere: PT.object, // eslint-disable-line react/forbid-prop-types
    doHentVeileder: PT.func.isRequired,
};

const mapStateToProps = state => ({
    oppfolgingStatus: state.data.oppfolgingStatus,
    veiledere: state.data.veiledere.data,
});

const mapDispatchToProps = dispatch => ({
    doHentVeileder: veilederId => dispatch(hentVeileder(veilederId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    OppfolgingPeriodeInnslag
);
