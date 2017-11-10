import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../../proptypes';
import { hentKanaler } from '../kanaler-reducer';
import Select from '../../../felles-komponenter/skjema/input/select';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { selectKanalerData, selectKanalerStatus } from '../kanaler-selector';

class VelgKanal extends Component {
    componentDidMount() {
        this.props.doHentKanaler();
    }

    render() {
        const { kanaler, avhengigheter, labelId, disabled } = this.props;

        const lagkanalOption = kanal =>
            <FormattedMessage key={kanal} id={`kanal.${kanal}`.toLowerCase()}>
                {kanalTekst =>
                    <option value={kanal}>
                        {kanalTekst}
                    </option>}
            </FormattedMessage>;

        return (
            <Innholdslaster avhengigheter={avhengigheter}>
                <Select
                    feltNavn="kanal"
                    disabled={disabled}
                    labelId={labelId}
                    bredde="fullbredde"
                >
                    {kanaler.map(lagkanalOption)}
                </Select>
            </Innholdslaster>
        );
    }
}

VelgKanal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    kanaler: PT.arrayOf(PT.string).isRequired,
    labelId: PT.string.isRequired,
    disabled: PT.bool,
    doHentKanaler: PT.func.isRequired,
};

VelgKanal.defaultProps = {
    disabled: false,
};

const mapStateToProps = state => ({
    avhengigheter: [selectKanalerStatus(state)],
    kanaler: selectKanalerData(state),
});

const mapDispatchToProps = dispatch => ({
    doHentKanaler: () => dispatch(hentKanaler()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VelgKanal);
