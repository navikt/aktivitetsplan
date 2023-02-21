/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import PT from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import visibleIfHOC from '../../hocs/visible-if';
import * as AppPT from '../../proptypes';
import { hentMalverkMedType, settValgtMalverk, slettValgtMalverk } from './malverk-reducer';
import { selectMalverkData, selectMalverkMedTittel, selectMalverkStatus } from './malverk-selector';

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
        const { doSlettValgtMalverk } = this.props;
        doSlettValgtMalverk();
    }

    onChangeMalverk = (event) => {
        const { doHentMalverkMedTittel, doSettValgtMalverk, onChange } = this.props;
        event.preventDefault();
        // event.target.value er tittel på malverk
        const valgtMalverk = doHentMalverkMedTittel(event.target.value);
        doSettValgtMalverk(valgtMalverk);
        onChange(valgtMalverk[0]);
    };

    render() {
        const { malverk, avhengigheter, endre } = this.props;
        const malverkOptions = Object.values(malverk).map(lagMalverkOption);

        const domId = 'malverk';
        return (
            !endre && (
                <div className="skjemaelement">
                    <Innholdslaster avhengigheter={avhengigheter} spinnerSize="S">
                        <label className="skjemaelement__label" htmlFor={domId}>
                            Ferdig utfylt aktivitet
                        </label>
                        <div className="selectContainer input--fullbredde">
                            <select
                                className="skjemaelement__input"
                                id={domId}
                                name="malverk"
                                onChange={this.onChangeMalverk}
                            >
                                <option value="ingen">Ingen ferdig utfylt aktivitet valgt</option>
                                {malverkOptions}
                            </select>
                        </div>
                    </Innholdslaster>
                </div>
            )
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
    onChange: PT.func,
    endre: PT.bool,
    type: PT.string.isRequired,
};

Malverk.defaultProps = {
    endre: false,
    malverk: undefined,
    onChange: () => null,
};

const mapDispatchToProps = (dispatch) => ({
    doHentMalverMedType: (type) => {
        dispatch(hentMalverkMedType(type));
    },
    doSettValgtMalverk: (valgtMalverk) => {
        dispatch(settValgtMalverk(valgtMalverk));
    },
    doSlettValgtMalverk: () => {
        dispatch(slettValgtMalverk());
    },
});

const mapStateToProps = (state) => ({
    malverk: selectMalverkData(state),
    avhengigheter: [selectMalverkStatus(state)],
    doHentMalverkMedTittel: (tittel) => selectMalverkMedTittel(state, tittel),
});

export default visibleIfHOC(connect(mapStateToProps, mapDispatchToProps)(Malverk));
