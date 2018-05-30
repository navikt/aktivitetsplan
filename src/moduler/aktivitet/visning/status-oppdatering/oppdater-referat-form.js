import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { Knapp } from 'nav-frontend-knapper';
import {
    oppdaterReferat,
    publiserReferat,
} from '../../aktivitet-referat-reducer';
import { STATUS } from '../../../../ducks/utils';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import hiddenIf from '../../../../felles-komponenter/hidden-if/hidden-if';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import { HiddenIfHovedknapp } from '../../../../felles-komponenter/hidden-if/hidden-if-knapper';
import { selectReferatStatus } from '../../aktivitet-referat-selector';

const REFERAT_MAKS_LENGDE = 5000;

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
            if (response === undefined) {
                dispatchPubliserReferat(response);
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
                placeholderId={'referat.form.placeholder'}
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
        form: 'oppdater-referat',
        initialValues: {
            referat,
        },
        oppdaterer: selectReferatStatus(state) === STATUS.PENDING,
        erReferatPublisert,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { aktivitet, onFerdig } = props;
    return {
        dispatchPubliserReferat: () => dispatch(publiserReferat(aktivitet)),
        onSubmit: referatData => {
            const aktivitetMedOppdatertReferat = {
                ...aktivitet,
                ...referatData,
            };
            return dispatch(oppdaterReferat(aktivitetMedOppdatertReferat)).then(
                onFerdig
            );
        },
    };
};

export default hiddenIf(
    connect(mapStateToProps, mapDispatchToProps)(NyHenvendelseReduxForm)
);
