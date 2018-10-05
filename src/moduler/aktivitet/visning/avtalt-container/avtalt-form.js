import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { validForm } from 'react-redux-form-validation';
import { FormattedMessage, injectIntl } from 'react-intl';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { HjelpetekstHoyre, HjelpetekstOver } from 'nav-frontend-hjelpetekst';
import { Knapp } from 'nav-frontend-knapper';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import Checkbox from '../../../../felles-komponenter/skjema/input/checkbox';
import Select from '../../../../felles-komponenter/skjema/input/select';

const SEND_FORHANDSORIENTERING = 'send_forhandsorientering';
const SEND_PARAGRAF_11_9 = 'send_paragraf_11_9';
const IKKE_SEND_FORHANDSORIENTERING = 'ikke_send_forhandsorientering';

const FORHANDSORIENTERING_MAKS_LENGDE = 500;
const begrensetForhandsorienteringLengde = maksLengde(
    'sett-avtalt-forhandsorientering-lengde',
    FORHANDSORIENTERING_MAKS_LENGDE
);
const pakrevdForhandsorienteringLengde = pakrevd(
    'sett-avtalt-forhandsorientering-paakrevd'
);

function AvtaltForm({
    handleSubmit,
    className,
    currentAvtaltSelect,
    currentAvtaltCheckbox,
}) {
    const forhadsorienteringsstekst = (
        <Normaltekst className="blokk-xs">
            <FormattedMessage id="sett-avtalt-forhandsorientering-tekst" />
        </Normaltekst>
    );

    const forhadsorienteringstekstParagraf119 = (
        <Textarea
            feltNavn="avtaltText"
            maxLength={FORHANDSORIENTERING_MAKS_LENGDE}
        />
    );

    return (
        <form
            onSubmit={handleSubmit}
            noValidate="noValidate"
            autoComplete="off"
            className={className}
        >
            <Undertittel>
                <FormattedMessage id="sett-avtalt.header" />
            </Undertittel>
            <div className="avtalt-container__radio">
                <Checkbox
                    labelId="sett-avtalt.label"
                    name="avtalt"
                    feltNavn="avtaltCheckbox"
                    disabled={false} // lasterData
                />
                <HjelpetekstOver>
                    <FormattedMessage id="sett-avtalt.hjelpetekst" />
                </HjelpetekstOver>
            </div>
            {currentAvtaltCheckbox &&
                <div className="avtalt-container__innhold">
                    <Select
                        labelId="sett-avtalt-velg-type"
                        feltNavn="avtaltSelect"
                        noBlankOption
                    >
                        <FormattedMessage id="sett-avtalt-send-forhandsorientering">
                            {tekst =>
                                <option
                                    key={SEND_FORHANDSORIENTERING}
                                    value={SEND_FORHANDSORIENTERING}
                                >
                                    {tekst}
                                </option>}
                        </FormattedMessage>
                        <FormattedMessage id="sett-avtalt-send-paragraf-11-9">
                            {tekst =>
                                <option
                                    key={SEND_PARAGRAF_11_9}
                                    value={SEND_PARAGRAF_11_9}
                                >
                                    {tekst}
                                </option>}
                        </FormattedMessage>
                        <FormattedMessage id="sett-avtalt-ikke-send-forhandsorientering">
                            {tekst =>
                                <option
                                    key={IKKE_SEND_FORHANDSORIENTERING}
                                    value={IKKE_SEND_FORHANDSORIENTERING}
                                >
                                    {tekst}
                                </option>}
                        </FormattedMessage>
                    </Select>
                    {currentAvtaltSelect !== IKKE_SEND_FORHANDSORIENTERING &&
                        <div>
                            <EtikettLiten className="avtalt-tekst-etikett">
                                <FormattedMessage id="sett-avltalt-tekst-som-sendes" />
                            </EtikettLiten>
                            <HjelpetekstHoyre>
                                <FormattedMessage id="sett-avtalt-teskt-som-sendes-hjelpetekst" />
                            </HjelpetekstHoyre>
                            {currentAvtaltSelect === SEND_FORHANDSORIENTERING &&
                                forhadsorienteringsstekst}
                            {currentAvtaltSelect === SEND_PARAGRAF_11_9 &&
                                forhadsorienteringstekstParagraf119}
                        </div>}
                    <Knapp
                        spinner={false} // oppdaterer
                        disabled={false} // lasterData
                    >
                        <FormattedMessage id="sett-til-avtalt.bekreft-knapp" />
                    </Knapp>
                </div>}
        </form>
    );
}

AvtaltForm.propTypes = {
    handleSubmit: PT.func,
    className: PT.string,
    errorSummary: PT.node.isRequired,
    currentAvtaltSelect: PT.string,
    currentAvtaltCheckbox: PT.bool,
};

AvtaltForm.defaultProps = {
    handleSubmit: undefined,
    className: undefined,
    currentAvtaltSelect: SEND_FORHANDSORIENTERING,
    currentAvtaltCheckbox: false,
};

const formNavn = 'avtalt-aktivitet-form';
const AvtaltReduxForm = validForm({
    form: formNavn,
    enableReinitialize: false,
    validate: {
        avtaltText: [
            begrensetForhandsorienteringLengde,
            pakrevdForhandsorienteringLengde,
        ],
    },
})(AvtaltForm);

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(formNavn);
    return {
        initialValues: {
            avtaltSelect: SEND_FORHANDSORIENTERING,
            avtaltText: props.intl.formatMessage({
                id: 'sett-avtalt-paragra-11-9-tekst',
            }),
            avtaltCheckbox: false,
        },
        currentAvtaltSelect: selector(state, 'avtaltSelect'),
        currentAvtaltCheckbox: selector(state, 'avtaltCheckbox'),
    };
};

export default injectIntl(connect(mapStateToProps)(AvtaltReduxForm));
