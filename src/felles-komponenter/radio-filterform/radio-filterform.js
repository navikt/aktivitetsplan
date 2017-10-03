import React, { PropTypes as PT, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Radio } from 'nav-frontend-skjema';

class RadioFilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = { selected: undefined };
        this.changeSelected = this.changeSelected.bind(this);
    }

    changeSelected(e) {
        this.setState({ selected: e });
    }

    render() {
        const {
            onSubmit,
            data,
            createLabel,
            createValue,
            radioName,
            ...rest
        } = this.props;
        const { selected } = this.state;
        return (
            <div className="radio-filterform">
                <div className="radio-filterform__valg">
                    {data.map(o =>
                        <Radio
                            name={radioName}
                            label={createLabel(o)}
                            value={createValue(o)}
                            id={createValue(o)}
                            key={createValue(o)}
                            onChange={e => this.changeSelected(e.target.value)}
                        />
                    )}
                </div>
                <div className="knapperad blokk-xxs">
                    <button
                        className=" knapp knapp--hoved knapp--mini radio-velg--knapp"
                        onClick={event =>
                            onSubmit({ event, value: selected, ...rest })}
                        disabled={!selected}
                    >
                        <FormattedMessage id="components.filterform.button.velg" />
                    </button>
                    <button
                        className="knapp knapp--mini knapp--standard"
                        onClick={event => {
                            this.changeSelected(undefined);
                            onSubmit({ event, value: null, ...rest });
                        }}
                    >
                        <FormattedMessage id="components.filterform.button.nullstill" />
                    </button>
                </div>
            </div>
        );
    }
}

RadioFilterForm.propTypes = {
    data: PT.arrayOf(PT.object).isRequired,
    onSubmit: PT.func.isRequired,
    createLabel: PT.func.isRequired,
    createValue: PT.func.isRequired,
    radioName: PT.string.isRequired,
};

export default RadioFilterForm;
