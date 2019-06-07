/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import { connect } from 'react-redux';
import visibleIfHOC from "../../hocs/visible-if";
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import {
    selectMalverkData,
    selectMalverkMedTittel,
    selectMalverkStatus,
} from './malverk-selector';
import * as AppPT from '../../proptypes';
import {
    hentMalverkMedType,
    settValgtMalverk,
    slettValgtMalverk,
} from './malverk-reducer';

function lagMalverkOption(mal) {
    return (
        <option key={mal.tittel} value={mal.tittel}>
            {mal.tittel}
        </option>
    );
}

class Malverk extends Component {
    componentDidMount() {
        const { doHentMalverMedType, endre, type } = this.props;
        if (!endre) {
            doHentMalverMedType(type);
        }
    }

    componentWillUnmount() {
        const {doSlettValgtMalverk} = this.props;
        doSlettValgtMalverk();
    }

    onChangeMalverk = event => {
        const {doHentMalverkMedTittel, doSettValgtMalverk} = this.props;
        event.preventDefault();
        // event.target.value er tittel på malverk
        const valgtMalverk = doHentMalverkMedTittel(
            event.target.value
        );
        doSettValgtMalverk(valgtMalverk);
    };

    render() {
        const { malverk, avhengigheter, endre } = this.props;
        const malverkOptions = Object.values(malverk).map(lagMalverkOption);

        const domId = "malverk";
        return (
            !endre &&
            <div className="skjemaelement">
                <Innholdslaster
                    avhengigheter={avhengigheter}
                    spinnerStorrelse="S"
                >
                    <label className="skjemaelement__label" htmlFor={domId}>
                        <FormattedMessage id="aktivitet-form.label.malverk" />
                    </label>
                    <div className="selectContainer input--fullbredde">
                        <select
                            className="skjemaelement__input"
                            id={domId}
                            name="malverk"
                            onClick={this.onChangeMalverk}
                        >
                            <FormattedMessage id="aktivitet.form.ingen.utfylt.aktivitet.valgt">
                                {text =>
                                    <option value="ingen">
                                        {text}
                                    </option>}
                            </FormattedMessage>
                            {malverkOptions}
                        </select>
                    </div>
                </Innholdslaster>
            </div>
        );
    }
}

Malverk.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    malverk: PT.arrayOf(AppPT.malverktype),
    doHentMalverkMedTittel: PT.func.isRequired,
    doHentMalverMedType: PT.func.isRequired,
    doSettValgtMalverk: PT.func.isRequired,
    doSlettValgtMalverk: PT.func.isRequired,
    endre: PT.bool,
    type: PT.string.isRequired,
};

Malverk.defaultProps = {
    endre: false,
    malverk: undefined,
};

const mapDispatchToProps = dispatch => ({
    doHentMalverMedType: type => {
        dispatch(hentMalverkMedType(type));
    },
    doSettValgtMalverk: valgtMalverk => {
        dispatch(settValgtMalverk(valgtMalverk));
    },
    doSlettValgtMalverk: () => {
        dispatch(slettValgtMalverk());
    },
});

const mapStateToProps = state => ({
    malverk: selectMalverkData(state),
    avhengigheter: [selectMalverkStatus(state)],
    doHentMalverkMedTittel: tittel => selectMalverkMedTittel(state, tittel),
});

export default visibleIfHOC(
    connect(mapStateToProps, mapDispatchToProps)(Malverk)
);
