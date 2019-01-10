import React, { PropTypes as PT, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Radio } from 'nav-frontend-skjema';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { HiddenIf } from '../../utils';

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
            fjernNullstill,
            visLukkKnapp,
            ...rest
        } = this.props;
        const { selected } = this.state;

        const submitForm = event =>
            onSubmit({ event, value: selected, ...rest });

        return (
            <div className="radio-filterform">
                <form onSubmit={submitForm}>
                    <div className="radio-filterform__valg">
                        {data.map(o =>
                            <Radio
                                name={radioName}
                                label={createLabel(o)}
                                value={createValue(o)}
                                id={`${createValue(o)}-${radioName}`}
                                key={`${createValue(o)}-${radioName}`}
                                onChange={e =>
                                    this.changeSelected(e.target.value)}
                            />
                        )}
                    </div>
                    <div className="knapperad--alignleft blokk-xxs">
                        <HiddenIf hidden={visLukkKnapp && !selected}>
                            <Hovedknapp
                                mini
                                htmlType="submit"
                                disabled={!selected}
                            >
                                <FormattedMessage id="components.filterform.button.velg" />
                            </Hovedknapp>
                        </HiddenIf>
                        <HiddenIf hidden={!visLukkKnapp || !!selected}>
                            <Knapp
                                mini
                                htmlType="button"
                                onClick={this.props.closeDropdown}
                            >
                                <FormattedMessage id="components.filterform.button.lukk" />
                            </Knapp>
                        </HiddenIf>
                        <HiddenIf hidden={fjernNullstill}>
                            <Knapp
                                mini
                                htmlType="button"
                                onClick={event => {
                                    this.changeSelected(undefined);
                                    onSubmit({ event, value: null, ...rest });
                                }}
                            >
                                <FormattedMessage id="components.filterform.button.nullstill" />
                            </Knapp>
                        </HiddenIf>
                    </div>
                </form>
            </div>
        );
    }
}

RadioFilterForm.propTypes = {
    data: PT.arrayOf(PT.object).isRequired,
    onSubmit: PT.func.isRequired,
    createLabel: PT.func.isRequired,
    createValue: PT.func.isRequired,
    closeDropdown: PT.func.isRequired,
    radioName: PT.string.isRequired,
    fjernNullstill: PT.bool,
    visLukkKnapp: PT.bool,
};

RadioFilterForm.defaultProps = {
    fjernNullstill: false,
    visLukkKnapp: false,
};

export default RadioFilterForm;
