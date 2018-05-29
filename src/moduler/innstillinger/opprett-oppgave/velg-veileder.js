import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, change } from 'redux-form';
import { connect } from 'react-redux';
import Dropdown from '../../../felles-komponenter/dropdown/dropdown';
import SokFilter from '../../../felles-komponenter/sok-filter/sok-filter';
import RadioFilterForm from '../../../felles-komponenter/radio-filterform/radio-filterform';
import { OPPRETT_OPPGAVE_FORM } from './opprett-oppgave';
import * as Utils from '../../../utils';
import * as AppPT from '../../../proptypes';

const hiddenInput = guid => () => <input type="hidden" id={guid} />;

const finnVeilederForIdent = (veilederliste, ident) =>
    veilederliste.find(veileder => veileder.ident === ident);

function settSammenNavn(veileder) {
    return `${veileder.etternavn}, ${veileder.fornavn}`;
}

class VelgVeileder extends Component {
    constructor(props) {
        super(props);
        this.state = { valgtVeileder: undefined };
        this.setValgtVeileder = this.setValgtVeileder.bind(this);
    }

    setValgtVeileder({ event, value, closeDropdown }) {
        event.preventDefault();
        const { endreVeilederIform } = this.props;
        endreVeilederIform(value);
        this.setState({ valgtVeileder: value });
        closeDropdown();
    }

    render() {
        const { veilederliste } = this.props;
        const { valgtVeileder } = this.state;
        const valgtVeilederObjekt = finnVeilederForIdent(
            veilederliste,
            valgtVeileder
        );
        const knappetekst = valgtVeilederObjekt
            ? settSammenNavn(valgtVeilederObjekt)
            : '';
        const veilederGuid = Utils.guid();

        return (
            <div>
                <label className="skjemaelement__label" htmlFor={veilederGuid}>
                    <FormattedMessage id="innstillinger.modal.opprett-oppgave.veileder.tittel" />
                </label>
                <Dropdown
                    knappeTekst={knappetekst}
                    className="input--m velg-enhet-veileder--dropdown"
                    name="velg-veileder-dropdown"
                >
                    <SokFilter data={veilederliste} label="" placeholder="">
                        {(data, props) =>
                            <RadioFilterForm
                                onSubmit={this.setValgtVeileder}
                                createLabel={settSammenNavn}
                                createValue={veileder => veileder.ident}
                                radioName="velg-veileder"
                                data={data}
                                {...props}
                            />}
                    </SokFilter>
                </Dropdown>
                <Field
                    component={hiddenInput(veilederGuid)}
                    name="veilederId"
                />
            </div>
        );
    }
}

VelgVeileder.propTypes = {
    veilederliste: PT.arrayOf(AppPT.veileder).isRequired,
    endreVeilederIform: PT.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        endreVeilederIform: veileder =>
            dispatch(change(OPPRETT_OPPGAVE_FORM, 'veilederId', veileder)),
    };
}

export default connect(null, mapDispatchToProps)(VelgVeileder);
