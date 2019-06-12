import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { Knapp } from 'nav-frontend-knapper';
import { oppdaterReferat, publiserReferat } from '../../aktivitet-actions';
import { STATUS } from '../../../../ducks/utils';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import hiddenIf from '../../../../felles-komponenter/hidden-if/hidden-if';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import { HiddenIfHovedknapp } from '../../../../felles-komponenter/hidden-if/hidden-if-knapper';
import { selectAktivitetStatus } from '../../aktivitet-selector';

const REFERAT_MAKS_LENGDE = 5000;
export const OPPDATER_REFERAT_FORM_NAME = 'oppdater-referat';

function OppdaterReferatForm({
    errorSummary,
    handleSubmit,
    oppdaterer,
    erReferatPublisert,
    dispatchPubliserReferat,
}) {
    function oppdaterOgPubliser(e) {
        e.preventDefault();
        handleSubmit(e).then(response => {
            if (response.data) {
                dispatchPubliserReferat(response.data);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            {errorSummary}
            <Textarea
                feltNavn="referat"
                maxLength={REFERAT_MAKS_LENGDE}
                disabled={oppdaterer}
                placeholderId="referat.form.placeholder"
            />

            <HiddenIfHovedknapp
                spinner={oppdaterer}
                disabled={oppdaterer}
                hidden={erReferatPublisert}
                onClick={oppdaterOgPubliser}
            >
                <FormattedMessage id="referat.form.publiser" />
            </HiddenIfHovedknapp>

            <Knapp spinner={oppdaterer} disabled={oppdaterer}>
                <FormattedMessage id="referat.form.lagre" />
            </Knapp>
        </form>
    );
}

OppdaterReferatForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    oppdaterer: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
};

const NyHenvendelseReduxForm = validForm({
    errorSummaryTitle: (
        <FormattedMessage id="referat.form.feiloppsummering-tittel" />
    ),
    validate: {
        referat: [
            pakrevd('referat.form.pakrevd-referat'),
            maksLengde('referat.form.referat-lengde', REFERAT_MAKS_LENGDE),
        ],
    },
})(OppdaterReferatForm);

const mapStateToProps = (state, props) => {
    const { referat, erReferatPublisert } = props.aktivitet;
    return {
        form: OPPDATER_REFERAT_FORM_NAME,
        initialValues: {
            referat,
        },
        oppdaterer:
            selectAktivitetStatus(state) ===
            (STATUS.PENDING || STATUS.RELOADING),
        erReferatPublisert,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    dispatchPubliserReferat: aktivitet => dispatch(publiserReferat(aktivitet)),
    onSubmit: referatData => {
        const aktivitetMedOppdatertReferat = {
            ...props.aktivitet,
            ...referatData,
        };
        return dispatch(
            oppdaterReferat(aktivitetMedOppdatertReferat)
        ).then(res => {
            props.onFerdig();
            return res;
        });
    },
});

export default hiddenIf(
    connect(mapStateToProps, mapDispatchToProps)(NyHenvendelseReduxForm)
);
