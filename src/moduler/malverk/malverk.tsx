import { Select } from '@navikt/ds-react';
import PT from 'prop-types';
import React, { Component, EventHandler } from 'react';
import { connect } from 'react-redux';

import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import visibleIfHOC from '../../hocs/visible-if';
import * as AppPT from '../../proptypes';
import { Dispatch, RootState } from '../../store';
import { selectMalverkData, selectMalverkMedTittel, selectMalverkStatus } from './malverk-selector';
import { hentMalverk, settValgtMalverk, slettValgtMalverk } from './malverk-slice';

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
        onChange: (payload: Record<string, string>) => void;
    };

class Malverk extends Component<Props> {
    componentDidMount() {
        const { doHentMalverk, endre } = this.props;
        if (!endre) {
            doHentMalverk();
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
    doHentMalverk: PT.func.isRequired,
    doSettValgtMalverk: PT.func.isRequired,
    doSlettValgtMalverk: PT.func.isRequired,
    onChange: PT.func,
    endre: PT.bool,
};

(Malverk as any).defaultProps = {
    endre: false,
    malverk: undefined,
    onChange: () => null,
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    doHentMalverk: () => {
        dispatch(hentMalverk());
    },
    doSettValgtMalverk: (valgtMalverk: any) => {
        dispatch(settValgtMalverk(valgtMalverk));
    },
    doSlettValgtMalverk: () => {
        dispatch(slettValgtMalverk());
    },
});

const mapStateToProps = (state: RootState) => ({
    malverk: selectMalverkData(state),
    avhengigheter: [selectMalverkStatus(state)],
    doHentMalverkMedTittel: (tittel: string) => selectMalverkMedTittel(state, tittel),
});

export default visibleIfHOC(connect(mapStateToProps, mapDispatchToProps)(Malverk));
