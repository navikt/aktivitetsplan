import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { LabelledField, CustomField, validForm, rules } from 'react-redux-form-validation';
import Datovelger from './datovelger/datovelger';
import './skjema.less';


const fraDatoComponent = () => <Datovelger label="Fra dato" skjemanavn="egen-aktivitet" />;
const tilDatoComponent = () => <Datovelger label="Til dato" skjemanavn="egen-aktivitet" />;

function Textarea(props) {
    const cls = (className) => classNames(className);

    // let tekstomrade = null;
    // let antall = null;
    // const tell = () => { antall = tekstomrade.value.length; };
    //                 ref={(textarea) => { tekstomrade = textarea; }}
    //                 onKeyUp={tell}
    return (
        <div>
            <div className="skjema__input">
                <label className="skjema__label" htmlFor={props.id}>
                    {props.label}
                </label>
                <textarea
                    className={cls(props.className)}
                    type="text"
                    id={props.id}
                    style={{ maxWidth: '100%' }}
                    maxLength={props.maxLength}
                />
                {/* <span>{props.maxLength - antall}</span>*/}
            </div>
        </div>
    );
}

Textarea.defaultProps = {
    maxLength: 255
};

Textarea.propTypes = {
    id: PT.string.isRequired,
    label: PT.node.isRequired,
    maxLength: PT.number,
    className: PT.string
};

function EgenAktivitetForm(props) {
    return (
        <div className="aktivitetskjema">
            <div className="aktivitetskjema__header">
                <Element tag="h1">
                    <FormattedMessage id="egen-aktivitet-form.header" />
                </Element>
                <Undertekst>
                    <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                </Undertekst>
            </div>
            <form onSubmit={props.handleSubmit} noValidate="noValidate">
                {props.errorSummary}

                <LabelledField
                    name="tittel"
                    type="text"
                    className="skjema__input aktivitetskjema__tekstfelt"
                    inputClass="input--fullbredde"
                    labelClass="skjema__label"
                ><FormattedMessage id="egen-aktivitet-form.label.overskrift" /></LabelledField>
                <div className="dato-container">
                    <CustomField name="fraDato" customComponent={fraDatoComponent()} />
                    <CustomField name="tilDato" customComponent={tilDatoComponent()} />
                </div>
                <LabelledField
                    name="lenke"
                    type="text"
                    className="skjema__input aktivitetskjema__tekstfelt"
                    inputClass="input--fullbredde"
                    labelClass="skjema__label"
                ><FormattedMessage id="egen-aktivitet-form.label.lenke" /></LabelledField>
                <LabelledField
                    name="hensikt"
                    type="text"
                    className="skjema__input aktivitetskjema__tekstfelt"
                    inputClass="input--fullbredde"
                    labelClass="skjema__label"
                ><FormattedMessage id="egen-aktivitet-form.label.hensikt" /></LabelledField>
                <CustomField
                    name="beskrivelse"
                    customComponent={
                        <Textarea
                            id="besrkivelse-textarea"
                            className="skjema__input input--fullbredde aktivitetskjema__tekstomrade"
                            label={<FormattedMessage id="egen-aktivitet-form.label.beskrivelse" />}
                        />}
                />
            </form>
        </div>
    );
}

EgenAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired
};

const EgenAktivitetReduxForm = validForm({
    form: 'egen-aktivitet',
    onSubmit: () => {},
    validate: {
        tittel: [rules.required],
        fraDato: [rules.required],
        tilDato: [rules.required]
    }
})(EgenAktivitetForm);

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: 'PLANLAGT',
            ...aktivitet
        }
    };
};
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EgenAktivitetReduxForm);
