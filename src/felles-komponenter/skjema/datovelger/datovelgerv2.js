/* eslint-disable */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { Component } from 'react';
import PT from 'prop-types';
import MaskedInput from 'react-maskedinput';
import {
    autobind,
    datePickerToISODate,
    dateToISODate,
    erGyldigFormattertDato,
    erGyldigISODato,
    ISODateToDatePicker,
} from '../../../utils';
import DayPickerComponent from './day-picker';
import moment from 'moment';

function stopEvent(event) {
    try {
        event.nativeEvent.stopImmediatePropagation();
    } catch (e) {
        event.stopPropagation();
    }
}

function parseDato(dato) {
    return !!dato ? moment(dato).toDate() : undefined;
}

class DatoField extends Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            erApen: false,
        };
    }

    componentDidMount() {
        this.container.addEventListener('focusout', this.onFocusOut);
    }

    componentWillUnmount() {
        this.container.removeEventListener('focusout', this.onFocusOut);
    }

    onFocusOut(e) {
        const { relatedTarget } = e;
        if (relatedTarget) {
            const targetErChildnode =
                this.container && this.container.contains(relatedTarget);
            if (!targetErChildnode) {
                this.lukk(false);
            }
        }
    }

    onKeyUp(e) {
        const ESCAPE_KEYCODE = 27;
        if (e.which === ESCAPE_KEYCODE) {
            this.lukk();
        }
    }

    onDayClick(event) {
        const { input } = this.props;
        const { name, onChange, onBlur } = input;
        const isoDate = dateToISODate(new Date(event));

        onChange({ target: { name: name, value: isoDate } });
        onBlur({ target: { name: name, value: isoDate } });
        this.lukk();
    }

    toggle(e) {
        e.preventDefault();
        const { erApen } = this.state;
        if (erApen) {
            this.lukk();
        } else {
            this.apne();
        }
    }

    apne() {
        this.setState({
            erApen: true,
        });
    }

    lukk(settFokus = true) {
        this.setState({
            erApen: false,
        });
        if (settFokus) {
            this.toggleButton.focus();
        }
    }

    render() {
        const {
            label,
            disabled,
            tidligsteFom,
            senesteTom,
            touched,
            error,
            input,
        } = this.props;

        const { erApen } = this.state;
        const { value, id } = input;
        const maskedInputProps = {
            ...input,
            value: erGyldigISODato(value) ? ISODateToDatePicker(value) : value,
        };

        return (
            <div>
                <div
                    className="datovelger skjemaelement"
                    ref={container => {
                        this.container = container;
                    }}
                >
                    <label className="skjemaelement__label" htmlFor={id}>
                        {label}
                    </label>
                    <div // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role
                        className="datovelger__inner"
                        onClick={stopEvent}
                    >
                        <div className="datovelger__inputContainer">
                            <MaskedInput
                                type="tel"
                                mask="11.11.1111"
                                autoComplete="off"
                                placeholder="dd.mm.åååå"
                                id={id}
                                disabled={disabled}
                                className={`skjemaelement__input input--m datovelger__input ${touched &&
                                error
                                    ? 'skjemaelement__input--harFeil'
                                    : ''}`}
                                {...maskedInputProps}
                            />
                            <button
                                className="js-toggle datovelger__toggleDayPicker"
                                aria-label={
                                    erApen
                                        ? 'Skjul datovelger'
                                        : 'Vis datovelger'
                                }
                                ref={toggle => {
                                    this.toggleButton = toggle;
                                }}
                                id={`toggle-${id}`}
                                disabled={disabled}
                                onKeyUp={this.onKeyUp}
                                onClick={this.toggle}
                                aria-pressed={erApen}
                                type="button"
                            />
                        </div>
                        {erApen &&
                            <DayPickerComponent
                                input={input}
                                ariaControls={`toggle-${id}`}
                                tidligsteFom={parseDato(tidligsteFom)}
                                senesteTom={parseDato(senesteTom)}
                                onDayClick={this.onDayClick}
                                onKeyUp={this.onKeyUp}
                                lukk={this.lukk}
                            />}
                    </div>
                    <div
                        role="alert"
                        aria-live="assertive"
                        className="skjemaelement__feilmelding"
                    >
                        {error && touched ? error : null}
                    </div>
                </div>
            </div>
        );
    }
}

DatoField.propTypes = {
    label: PT.oneOfType([PT.string, PT.node]).isRequired,
    disabled: PT.bool,
    tidligsteFom: PT.string,
    senesteTom: PT.string,
    touched: PT.bool.isRequired,
    error: PT.string,
    input: PT.shape({
        id: PT.string.isRequired,
        name: PT.string.isRequired,
        value: PT.string,
        onChange: PT.func.isRequired,
        onBlur: PT.func.isRequired,
    }).isRequired,
};

DatoField.defaultProps = {
    disabled: false,
    tidligsteFom: undefined,
    senesteTom: undefined,
    error: undefined,
};

export default DatoField;
