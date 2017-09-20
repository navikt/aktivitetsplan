import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../../proptypes';
import {
    selectKanaler,
    selectKanalerReducer,
    hentKanaler,
} from '../kanaler-reducer';
import Select from '../../../felles-komponenter/skjema/input/select';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';

class VelgKanal extends Component {
    componentDidMount() {
        this.props.doHentKanaler();
    }

    render() {
        const { kanaler, kanalerReducer, labelId, disabled } = this.props;

        return (
            <Innholdslaster avhengigheter={[kanalerReducer]}>
                <Select
                    feltNavn="kanal"
                    disabled={disabled}
                    labelId={labelId}
                    bredde="fullbredde"
                >
                    {kanaler.map(kanal =>
                        <FormattedMessage
                            key={kanal}
                            id={`kanal.${kanal}`.toLowerCase()}
                        >
                            {kanalTekst =>
                                <option value={kanal}>
                                    {kanalTekst}
                                </option>}
                        </FormattedMessage>
                    )}
                </Select>
            </Innholdslaster>
        );
    }
}

VelgKanal.propTypes = {
    kanalerReducer: AppPT.reducer.isRequired,
    kanaler: PT.arrayOf(PT.string).isRequired,
    labelId: PT.string.isRequired,
    disabled: PT.bool,
    doHentKanaler: PT.func.isRequired,
};

VelgKanal.defaultProps = {
    disabled: false,
};

const mapStateToProps = state => ({
    kanalerReducer: selectKanalerReducer(state),
    kanaler: selectKanaler(state),
});

const mapDispatchToProps = dispatch => ({
    doHentKanaler: () => dispatch(hentKanaler()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VelgKanal);
