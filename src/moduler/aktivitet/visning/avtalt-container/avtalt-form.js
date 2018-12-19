import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { validForm } from 'react-redux-form-validation';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { HjelpetekstOver } from 'nav-frontend-hjelpetekst';
import { Knapp } from 'nav-frontend-knapper';
import classNames from 'classnames';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import Checkbox from '../../../../felles-komponenter/skjema/input/checkbox';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import AvtaltFormBrukerUnderOppfolgning from './avtalt-form-bruker-under-oppfolgning';
import AvtaltStripeKRRKvpManuellBruker from './avtalt-alertstripe-manuell-krr-kvp-bruker';
import AvtaltFormMindreEnnSyvDager from './avtalt-form-mindre-enn-syv-dager';

export const SEND_FORHANDSORIENTERING = 'send_forhandsorientering';
export const SEND_PARAGRAF_11_9 = 'send_paragraf_11_9';
export const IKKE_SEND_FORHANDSORIENTERING = 'ikke_send_forhandsorientering';

export const FORHANDSORIENTERING_MAKS_LENGDE = 500;
export const begrensetForhandsorienteringLengde = maksLengde(
    'sett-avtalt-forhandsorientering-lengde',
    FORHANDSORIENTERING_MAKS_LENGDE
);
export const pakrevdForhandsorienteringLengde = pakrevd(
    'sett-avtalt-forhandsorientering-paakrevd'
);

function AvtaltForm({
    handleSubmit,
    className,
    oppdaterer,
    lasterData,
    currentAvtaltSelect,
    currentAvtaltCheckbox,
    erManuellKrrKvpBruker,
    visAvtaltMedNavMindreEnnSyvDager,
}) {
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
                    disabled={lasterData}
                />
                <HjelpetekstOver>
                    <FormattedMessage id="sett-avtalt.hjelpetekst" />
                </HjelpetekstOver>
            </div>
            <VisibleIfDiv
                className={classNames({
                    'avtalt-container__innhold':
                        !erManuellKrrKvpBruker &&
                        !visAvtaltMedNavMindreEnnSyvDager,
                    'avtalt-container__alertstripe':
                        erManuellKrrKvpBruker ||
                        visAvtaltMedNavMindreEnnSyvDager,
                })}
                visible={currentAvtaltCheckbox}
            >
                <AvtaltStripeKRRKvpManuellBruker
                    visible={erManuellKrrKvpBruker}
                />
                <AvtaltFormBrukerUnderOppfolgning
                    visible={
                        !erManuellKrrKvpBruker &&
                        !visAvtaltMedNavMindreEnnSyvDager
                    }
                    currentAvtaltSelect={currentAvtaltSelect}
                    forhandsorienteringMaksLengde={
                        FORHANDSORIENTERING_MAKS_LENGDE
                    }
                />
                <AvtaltFormMindreEnnSyvDager
                    visible={
                        !erManuellKrrKvpBruker &&
                        visAvtaltMedNavMindreEnnSyvDager
                    }
                />
                <Knapp spinner={oppdaterer} disabled={lasterData}>
                    <FormattedMessage
                        id="sett-til-avtalt.bekreft-knapp"
                        values={{
                            ikkeSend:
                                currentAvtaltSelect ===
                                    IKKE_SEND_FORHANDSORIENTERING ||
                                erManuellKrrKvpBruker ||
                                visAvtaltMedNavMindreEnnSyvDager,
                        }}
                    />
                </Knapp>
            </VisibleIfDiv>
        </form>
    );
}

AvtaltForm.propTypes = {
    handleSubmit: PT.func,
    className: PT.string,
    oppdaterer: PT.bool.isRequired,
    lasterData: PT.bool.isRequired,
    currentAvtaltSelect: PT.string,
    currentAvtaltCheckbox: PT.bool,
    erManuellKrrKvpBruker: PT.bool.isRequired,
    visAvtaltMedNavMindreEnnSyvDager: PT.bool.isRequired,
};

AvtaltForm.defaultProps = {
    handleSubmit: undefined,
    className: undefined,
    currentAvtaltSelect: SEND_FORHANDSORIENTERING,
    currentAvtaltCheckbox: false,
};

export const AVTALT_AKTIVITET_FORM_NAME = 'avtalt-aktivitet-form';
const AvtaltReduxForm = validForm({
    form: AVTALT_AKTIVITET_FORM_NAME,
    enableReinitialize: false,
    validate: {
        avtaltText119: [
            begrensetForhandsorienteringLengde,
            pakrevdForhandsorienteringLengde,
        ],
    },
})(AvtaltForm);

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(AVTALT_AKTIVITET_FORM_NAME);
    return {
        initialValues: {
            avtaltSelect: SEND_FORHANDSORIENTERING,
            avtaltText119: props.intl.formatMessage({
                id: 'sett-avtalt-paragraf-11-9-tekst',
            }),
            avtaltText: props.intl.formatMessage({
                id: 'sett-avtalt-forhandsorientering-tekst',
            }),
            avtaltCheckbox: false,
        },
        currentAvtaltSelect: selector(state, 'avtaltSelect'),
        currentAvtaltCheckbox: selector(state, 'avtaltCheckbox'),
    };
};

export default injectIntl(connect(mapStateToProps)(AvtaltReduxForm));
