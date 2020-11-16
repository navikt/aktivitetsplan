import useFormstate from '@nutgaard/use-formstate';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';

import { STATUS } from '../../../../ducks/utils';
import hiddenIfHOC from '../../../../felles-komponenter/hidden-if/hidden-if';
import { HiddenIfHovedknapp } from '../../../../felles-komponenter/hidden-if/hidden-if-knapper';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Textarea from '../../../../felles-komponenter/skjema/input/textarea';
import * as AppPT from '../../../../proptypes';
import { DirtyContext } from '../../../context/dirty-context';
import { oppdaterReferat, publiserReferat } from '../../aktivitet-actions';
import { selectAktivitetStatus } from '../../aktivitet-selector';

const FlatKnappVisible = hiddenIfHOC(Flatknapp);

function validate(val) {
    if (val.trim().length === 0) {
        return 'Du må fylle ut samtalereferat';
    }
    if (val.length > 5000) {
        return 'Du må korte ned teksten til 5000 tegn';
    }
    return null;
}

const validator = useFormstate({
    referat: validate,
});

const label = <Undertittel>Samtalereferat</Undertittel>;

function OppdaterReferatForm(props) {
    const { onSubmit, aktivitet, oppdaterer, erReferatPublisert, dispatchPubliserReferat, onFerdig } = props;

    const state = validator({
        referat: aktivitet.referat || '',
    });

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('referat', !state.pristine);

        return function cleanup() {
            setFormIsDirty('referat', false);
        };
    }, [setFormIsDirty, state.pristine]);

    const oppdaterOgPubliser = state.onSubmit((values) => {
        return onSubmit(values).then((response) => {
            if (response.data) {
                dispatchPubliserReferat(response.data);
            }
        });
    });

    return (
        <form onSubmit={state.onSubmit(onSubmit)} className="oppdater-referat aktivitetvisning__underseksjon">
            <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
            <Textarea
                label={label}
                disabled={oppdaterer}
                maxLength={5000}
                visTellerFra={500}
                placeholder="Skriv samtalereferatet her"
                {...state.fields.referat}
            />

            <HiddenIfHovedknapp
                kompakt
                spinner={oppdaterer}
                disabled={oppdaterer}
                hidden={erReferatPublisert}
                onClick={oppdaterOgPubliser}
            >
                Del med bruker
            </HiddenIfHovedknapp>

            <Knapp type={erReferatPublisert ? 'hoved' : 'standard'} kompakt spinner={oppdaterer} disabled={oppdaterer}>
                {erReferatPublisert ? 'Del endring' : 'Lagre utkast'}
            </Knapp>

            <FlatKnappVisible hidden={!aktivitet.referat} kompakt onClick={onFerdig}>
                Avbryt
            </FlatKnappVisible>
        </form>
    );
}

OppdaterReferatForm.propTypes = {
    onSubmit: PT.func.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    oppdaterer: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    onFerdig: PT.func.isRequired,
};

const mapStateToProps = (state, props) => {
    const { erReferatPublisert } = props.aktivitet;
    return {
        oppdaterer: selectAktivitetStatus(state) === (STATUS.PENDING || STATUS.RELOADING),
        erReferatPublisert,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    dispatchPubliserReferat: (aktivitet) => dispatch(publiserReferat(aktivitet)),
    onSubmit: (referatData) => {
        const aktivitetMedOppdatertReferat = {
            ...props.aktivitet,
            ...referatData,
        };
        return dispatch(oppdaterReferat(aktivitetMedOppdatertReferat)).then((res) => {
            props.onFerdig();
            return res;
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OppdaterReferatForm);
