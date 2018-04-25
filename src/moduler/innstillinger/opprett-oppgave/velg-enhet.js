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

const finnEnhetnavnForId = (enhetliste, id) =>
    enhetliste.find(enhet => enhet.enhetId === id);

function settSammenNavn(enhet) {
    return `${enhet.enhetId} ${enhet.navn}`;
}

class VelgEnhet extends Component {
    constructor(props) {
        super(props);
        const { enhetliste } = this.props;
        const initiellEnhet = enhetliste[0].enhetId;
        this.state = { valgtEnhet: initiellEnhet };

        this.setValgtEnhet = this.setValgtEnhet.bind(this);
    }

    componentDidMount() {
        const { endreEnhetIform, hentVeiledere } = this.props;
        const { valgtEnhet } = this.state;
        endreEnhetIform(valgtEnhet);
        hentVeiledere(valgtEnhet);
    }

    setValgtEnhet({ event, value, closeDropdown }) {
        event.preventDefault();
        const { endreEnhetIform, hentVeiledere } = this.props;
        endreEnhetIform(value);
        hentVeiledere(value);
        this.setState({ valgtEnhet: value });
        closeDropdown();
    }

    render() {
        const { enhetliste } = this.props;
        const { valgtEnhet } = this.state;

        const valgtEnhetObjekt = finnEnhetnavnForId(enhetliste, valgtEnhet);

        const knappetekst = valgtEnhetObjekt
            ? settSammenNavn(valgtEnhetObjekt)
            : '';
        const enhetGuid = Utils.guid();

        return (
            <div>
                <label className="skjemaelement__label" htmlFor={enhetGuid}>
                    <FormattedMessage id="innstillinger.modal.opprett-oppgave.enhet.tittel" />
                </label>
                <Dropdown
                    knappeTekst={knappetekst}
                    className="input--m velg-enhet-veileder--dropdown"
                    name="velg-enhet-dropdown"
                >
                    <SokFilter data={enhetliste} label="" placeholder="">
                        {(data, props) =>
                            <RadioFilterForm
                                onSubmit={this.setValgtEnhet}
                                createLabel={settSammenNavn}
                                createValue={enhet => enhet.enhetId}
                                radioName="velg-enhet"
                                data={data}
                                fjernNullstill
                                {...props}
                            />}
                    </SokFilter>
                </Dropdown>
                <Field component={hiddenInput(enhetGuid)} name="enhetId" />
            </div>
        );
    }
}

VelgEnhet.propTypes = {
    enhetliste: PT.arrayOf(AppPT.veileder).isRequired,
    endreEnhetIform: PT.func.isRequired,
    hentVeiledere: PT.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        endreEnhetIform: enhet =>
            dispatch(change(OPPRETT_OPPGAVE_FORM, 'enhetId', enhet)),
    };
}

export default connect(null, mapDispatchToProps)(VelgEnhet);
