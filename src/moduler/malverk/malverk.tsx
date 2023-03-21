/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import { Select } from '@navikt/ds-react';
import PT from 'prop-types';
import React, { Component, EventHandler } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import visibleIfHOC from '../../hocs/visible-if';
import * as AppPT from '../../proptypes';
import { State } from '../../reducer';
import { hentMalverkMedType, settValgtMalverk, slettValgtMalverk } from './malverk-reducer';
import { selectMalverkData, selectMalverkMedTittel, selectMalverkStatus } from './malverk-selector';

function lagMalverkOption(mal: any) {
    return (
        <option key={mal.tittel} value={mal.tittel}>
            {mal.tittel}
        </option>
    );
}

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> & {
        endre: boolean;
        type: 'SOKEAVTALE' | 'EGEN';
        onChange: (payload: Record<string, string>) => void;
    };

class Malverk extends Component<Props> {
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

    onChangeMalverk: EventHandler<any> = (event) => {
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
                    <Innholdslaster className="flex m-auto" avhengigheter={avhengigheter} spinnerSize="large">
                        <Select
                            id={domId}
                            name={'malverk'}
                            label="Ferdig utfylt aktivitet"
                            onChange={this.onChangeMalverk}
                        >
                            <option value="ingen">Ingen ferdig utfylt aktivitet valgt</option>
                            {malverkOptions}
                        </Select>
                    </Innholdslaster>
                </div>
            )
        );
    }
}

(Malverk as any).propTypes = {
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

(Malverk as any).defaultProps = {
    endre: false,
    malverk: undefined,
    onChange: () => null,
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    doHentMalverMedType: (type: any) => {
        dispatch(hentMalverkMedType(type) as any);
    },
    doSettValgtMalverk: (valgtMalverk: any) => {
        dispatch(settValgtMalverk(valgtMalverk));
    },
    doSlettValgtMalverk: () => {
        dispatch(slettValgtMalverk());
    },
});

const mapStateToProps = (state: State) => ({
    malverk: selectMalverkData(state),
    avhengigheter: [selectMalverkStatus(state)],
    doHentMalverkMedTittel: (tittel: string) => selectMalverkMedTittel(state, tittel),
});

export default visibleIfHOC(connect(mapStateToProps, mapDispatchToProps)(Malverk));
