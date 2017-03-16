import React, { Component, PropTypes as PT } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Hovedknapp } from 'nav-react-design/dist/knapp';
import { connect } from 'react-redux';
import moment from 'moment';
import EndreAktivitetStatus from './endre-aktivitet-status';
import EndreAktivitetEtikett from './endre-aktivitet-etikett';
import DateField from '../../felles-komponenter/date-field';

// Skriv om til stateless når ting har stabiliert seg litt mer
// eslint-disable-next-line react/prefer-stateless-function
class StillingAktivitetForm extends Component {

    render() {
        const { handleSubmit, change, etikett } = this.props;

        return (
            <form onSubmit={handleSubmit} className="skjema-innlogget">
                <div className="row">
                    <div className="col-md-9">
                        <div className="nav-input">
                            <label htmlFor="stilling-aktivitet-tittel">Type stilling (overskrift)</label>
                            <Field
                                name="tittel" type="text"
                                className="input-fullbredde"
                                component="input"
                                required
                                autoFocus
                                placeholder="Type stilling (overskrift)"
                                id="stilling-aktivitet-tittel"
                            />
                        </div>
                        <div className="felt-vannrett">
                            <div className="nav-input">
                                <DateField name="fraDato" label="fra dato" disabled />
                            </div>
                            <div className="nav-input">
                                <DateField name="tilDato" label="til dato" required />
                            </div>
                        </div>
                        <div className="nav-input">
                            <label htmlFor="stilling-aktivitet-lenke">Lenke</label>
                            <Field
                                name="lenke"
                                className="input-fullbredde"
                                type="text"
                                component="input"
                                placeholder="Lenke"
                                id="stilling-aktivitet-lenke"
                            />
                        </div>
                        <div className="nav-input">
                            <label htmlFor="stilling-aktivitet-beskrivelse">Beskrivelse</label>
                            <Field
                                name="beskrivelse"
                                className="input-fullbredde"
                                type="text"
                                component="textarea"
                                placeholder="Beskrivelse"
                                id="stilling-aktivitet-beskrivelse"
                            />
                        </div>
                        <div className="nav-input">
                            <label htmlFor="stilling-aktivitet-arbeidssted">Arbeidssted</label>
                            <Field
                                name="arbeidssted"
                                className="input-fullbredde"
                                type="text"
                                component="input"
                                placeholder="Arbeidssted"
                                id="stilling-aktivitet-arbeidssted"
                            />
                        </div>
                        <div className="nav-input">
                            <label htmlFor="stilling-aktivitet-arbeidsgiver">Arbeidsgiver</label>
                            <Field
                                name="arbeidsgiver"
                                className="input-fullbredde"
                                type="text"
                                component="input"
                                placeholder="Arbeidsgiver"
                                id="stilling-aktivitet-arbeidsgiver"
                            />
                        </div>
                        <div className="nav-input">
                            <label htmlFor="stilling-aktivitet-kontaktperson">Kontaktperson</label>
                            <Field
                                name="kontaktperson"
                                className="input-fullbredde"
                                type="text"
                                component="input"
                                placeholder="Kontaktperson for stillingen"
                                id="stilling-aktivitet-kontaktperson"
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <Hovedknapp type="submit">Lagre</Hovedknapp>
                    </div>
                </div>
                <div>
                    <EndreAktivitetStatus />
                </div>
                <div>
                    <EndreAktivitetEtikett
                        valgtEtikett={etikett}
                        velgEtikett={(e) => change('etikett', e)}
                    />
                </div>
            </form>
        );
    }
}

StillingAktivitetForm.propTypes = {
    etikett: PT.string,

    // fra redux-form
    handleSubmit: PT.func.isRequired,
    change: PT.func.isRequired
};

const formNavn = 'stilling-aktivitet';
const StillingAktivitetReduxForm = reduxForm({
    form: formNavn
})(StillingAktivitetForm);

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: 'PLANLAGT',
            fraDato: moment().format(), // eslint-disable-line no-undef
            ...aktivitet
        },
        etikett: selector(state, 'etikett')
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StillingAktivitetReduxForm);
