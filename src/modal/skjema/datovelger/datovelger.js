import React, { Component, PropTypes as PT } from 'react';
import { Field, autofill, touch } from 'redux-form';
import { connect } from 'react-redux';
import MaskedInput from 'react-maskedinput';
import { erGyldigDato, erGyldigDatoformat, fraInputdatoTilJSDato, toDatePrettyPrint } from '../../../utils';
import DayPickerComponent from './day-picker';


class DatoField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            erApen: false
        };
    }

    onKeyUp(e) {
        const ESCAPE_KEYCODE = 27;
        if (e.which === ESCAPE_KEYCODE) {
            this.lukk();
        }
    }

    toggle() {
        if (this.state.erApen) {
            this.lukk();
        } else {
            this.apne();
        }
    }

    apne() {
        this.setState({
            erApen: true
        });
    }

    lukk() {
        this.setState({
            erApen: false
        });
        this.toggleButton.focus();
    }

    render() {
        const { meta, input, id, label, disabled, tidligsteFom, senesteTom } = this.props;

        return (
            <div className="datovelger">
                <label className="skjema__label" htmlFor={id}>{label}</label>
                <div // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role
                    className="datovelger__inner"
                    tabIndex=""
                    onClick={(event) => {
                        try {
                            event.nativeEvent.stopImmediatePropagation();
                        } catch (e) {
                            event.stopPropagation();
                        }
                    }}
                >
                    <div className="datovelger__inputContainer skjema__input">
                        <MaskedInput
                            type="tel"
                            mask="11.11.1111"
                            autoComplete="off"
                            placeholder="dd.mm.åååå"
                            id={id}
                            disabled={disabled}
                            className={`input--m datovelger__input${meta.touched && meta.error ? ' input--feil' : ''}`} {...input}
                        />
                        <button
                            className="js-toggle datovelger__toggleDayPicker"
                            aria-label={this.state.erApen ? 'Skjul datovelger' : 'Vis datovelger'}
                            ref={(toggle) => { this.toggleButton = toggle; }}
                            id={`toggle-${id}`}
                            disabled={disabled}
                            onKeyUp={(e) => {
                                this.onKeyUp(e);
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                this.toggle();
                            }}
                            aria-pressed={this.erApen}
                        />
                    </div>
                    { this.state.erApen && <DayPickerComponent
                        {...this.props}
                        ariaControls={`toggle-${id}`}
                        tidligsteFom={tidligsteFom}
                        senesteTom={senesteTom}
                        onDayClick={(event) => {
                            const { dispatch, skjemanavn } = this.props;
                            const s = toDatePrettyPrint(new Date(event));
                            dispatch(autofill(skjemanavn, this.props.input.name, s));
                            dispatch(touch(skjemanavn, this.props.input.name));
                            this.lukk();
                        }}
                        onKeyUp={(e) => {
                            this.onKeyUp(e);
                        }}
                        lukk={() => {
                            this.lukk();
                        }}
                    />}
                </div>
            </div>);
    }
}

DatoField.propTypes = {
    meta: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    id: PT.string.isRequired,
    label: PT.string.isRequired,
    input: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    dispatch: PT.func.isRequired,
    skjemanavn: PT.string.isRequired,
    disabled: PT.bool,
    tidligsteFom: PT.instanceOf(Date),
    senesteTom: PT.instanceOf(Date)
};

const ConnectedDatoField = connect()(DatoField);

export const validerPeriode = (input, alternativer) => {
    const { fra, til } = alternativer;
    const inputDato = fraInputdatoTilJSDato(input);
    if (fra && til && (inputDato < fra || inputDato > til)) {
        return `Datoen må være innenfor perioden ${toDatePrettyPrint(fra)}-${toDatePrettyPrint(til)}`;
    }
    if (til && inputDato > til) {
        return `Datoen må være før ${toDatePrettyPrint(til)}`;
    }
    if (fra && inputDato < fra) {
        return `Datoen må være etter ${toDatePrettyPrint(fra)}`;
    }
    return undefined;
};

export const validerDatoField = (input, alternativer) => {
    if (!input) {
        return undefined;
    } else if (!erGyldigDatoformat(input)) {
        return 'Datoen må være på formatet dd.mm.åååå';
    } else if (!erGyldigDato(input)) {
        return 'Datoen er ikke gyldig';
    } else if (alternativer && (alternativer.fra || alternativer.til)) {
        return validerPeriode(input, alternativer);
    }
    return undefined;
};

// TODO fiks skjemanavn og name
const Datovelger = (props) => (
    <Field
        name={'navn'}
        label={props.label}
        component={ConnectedDatoField}
        skjemanavn={props.skjemanavn}
        validate={(input) => (
            validerDatoField(input, {
                fra: props.tidligsteFom,
                til: props.senesteTom
            })
        )}
        disabled={props.disabled}
        {...props}
    />
);

Datovelger.propTypes = {
    label: PT.node.isRequired,
    skjemanavn: PT.string.isRequired,
    disabled: PT.bool,
    tidligsteFom: PT.instanceOf(Date),
    senesteTom: PT.instanceOf(Date)
};

export default Datovelger;
