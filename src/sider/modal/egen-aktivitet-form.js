import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Hovedknapp } from 'nav-react-design/dist/knapp';
import EndreAktivitetStatus from './endre-aktivitet-status';
import DateField from '../../felles-komponenter/date-field';

const validerTittel = (value) => {
    if (value !== '') {
        return undefined;
    }
    return 'Fyll inn tittel';
};

function EgenAktivitetForm({ handleSubmit }) {
    return (
        <form onSubmit={handleSubmit} className="skjema-innlogget">
            <div className="row">
                <div className="col-md-9">
                    <div className="nav-input">
                        <Field
                            name="tittel"
                            type="text"
                            className="input-fullbredde"
                            component="input"
                            placeholder="Overskrift"
                            required
                            autoFocus
                            validate={validerTittel}
                        />
                    </div>
                    <div className="felt-vannrett">
                        <div className="nav-input">
                            <DateField name="fraDato" label="fra dato" />
                        </div>
                        <div className="nav-input">
                            <DateField name="tilDato" label="til dato" />
                        </div>
                    </div>
                    <div className="nav-input">
                        <label htmlFor="egen-aktivitet-lenke">Lenke</label>
                        <Field
                            name="lenke" className="input-fullbredde" type="text"
                            component="input" placeholder="Lenke" id="egen-aktivitet-lenke"
                        />
                    </div>
                    <div className="nav-input">
                        <label htmlFor="egen-aktivitet-hensikt">Hensikt</label>
                        <Field
                            name="hensikt" className="input-fullbredde" type="text"
                            component="input" placeholder="Hensikt" id="egen-aktivitet-hensikt"
                        />
                    </div>
                    <div className="nav-input">
                        <label htmlFor="egen-aktivitet-beskrivelse">Beskrivelse</label>
                        <Field
                            name="beskrivelse" className="input-fullbredde" type="text"
                            component="textarea" placeholder="Beskrivelse" id="egen-aktivitet-beskrivelse"
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
        </form>
    );
}

EgenAktivitetForm.propTypes = {
    handleSubmit: PT.func
};

const EgenAktivitetReduxForm = reduxForm({
    form: 'egen-aktivitet'
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
