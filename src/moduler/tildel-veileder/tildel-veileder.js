import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import SokFilter from './../../felles-komponenter/sok-filter/sok-filter';
import Dropdown from './../../felles-komponenter/dropdown/dropdown';
import * as AppPT from '../../proptypes';
import RadioFilterForm from '../../felles-komponenter/radio-filterform/radio-filterform';
import { hentBruker } from '../bruker/bruker-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectBrukerStatus } from '../bruker/bruker-selector';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { hentArbeidsliste } from '../arbeidsliste/arbeidsliste-reducer';
import { tildelVeileder } from './tildel-veileder-reducer';
import {
    hentVeiledereForEnhet,
    selectVeilederListe,
    selectVeilederStatus,
} from '../veiledere-pa-enhet/veiledere-pa-enhet-reducer';
import { selectVeilederId } from '../oppfolging-status/oppfolging-selector';
import { hentOppfolging } from '../oppfolging-status/oppfolging-reducer';

function settSammenNavn(veileder) {
    return `${veileder.etternavn}, ${veileder.fornavn}`;
}

class TildelVeileder extends Component {
    constructor(props) {
        super(props);
        this.setValgtVeileder = this.setValgtVeileder.bind(this);
    }

    componentDidMount() {
        const { doHentVeiledereForEnhet } = this.props;
        doHentVeiledereForEnhet(getFodselsnummer());
    }

    setValgtVeileder({ event, value, closeDropdown }) {
        event.preventDefault();
        const fnr = getFodselsnummer();

        this.props.tildelTilVeileder(fnr, [
            {
                fraVeilederId: this.props.veilederId,
                tilVeilederId: value,
                brukerFnr: fnr,
            },
        ]);
        closeDropdown();
    }

    render() {
        const { avhengigheter, veilederliste } = this.props;

        return (
            <Dropdown
                knappeTekst={'Tildel veileder'}
                className="input-m tildel-veileder-dropdown"
                name="tildel-veileder-dropdown"
            >
                <Innholdslaster
                    avhengigheter={avhengigheter}
                    spinnerStorrelse="XL"
                >
                    {(_, sokFilterProps) =>
                        <SokFilter
                            data={veilederliste}
                            label=""
                            placeholder=""
                            limitSize={null}
                            {...sokFilterProps}
                        >
                            {(data, radioFilterProps) =>
                                <RadioFilterForm
                                    data={data}
                                    onSubmit={this.setValgtVeileder}
                                    createLabel={settSammenNavn}
                                    createValue={veileder => veileder.ident}
                                    radioName="velg-veileder"
                                    fjernNullstill
                                    visLukkKnapp
                                    {...radioFilterProps}
                                />}
                        </SokFilter>}
                </Innholdslaster>
            </Dropdown>
        );
    }
}

TildelVeileder.propTypes = {
    veilederliste: PT.arrayOf(AppPT.veileder).isRequired,
    tildelTilVeileder: PT.func.isRequired,
    doHentVeiledereForEnhet: PT.func.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    veilederId: PT.string,
};

TildelVeileder.defaultProps = {
    veilederliste: [],
    veilederId: null,
};

const mapStateToProps = state => ({
    veilederliste: selectVeilederListe(state),
    veilederId: selectVeilederId(state),
    avhengigheter: [selectBrukerStatus(state), selectVeilederStatus(state)],
});

const mapDispatchToProps = dispatch => ({
    tildelTilVeileder: (fnr, tilordning) =>
        dispatch(tildelVeileder(tilordning))
            .then(() => dispatch(hentOppfolging(fnr)))
            .then(() => dispatch(hentArbeidsliste(fnr))),
    doHentVeiledereForEnhet: fnr =>
        dispatch(hentBruker(fnr)).then(({ data }) =>
            dispatch(hentVeiledereForEnhet(data.behandlendeEnhet.enhetsnummer))
        ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TildelVeileder);
