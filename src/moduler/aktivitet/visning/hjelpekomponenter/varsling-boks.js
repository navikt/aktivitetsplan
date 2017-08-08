import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import {
    selectDialogForAktivitetId,
    selectDialogReducer,
} from '../../../dialog/dialog-selector';
import * as AppPT from '../../../../proptypes';
import Innholdslaster from '../../../../felles-komponenter/utils/innholdslaster';
import { MOTE_TYPE } from '../../../../constant';
import {
    selectErVeileder,
    selectIdentitetReducer,
} from '../../../identitet/identitet-selector';

function VarslingBoks({
    identitetReducer,
    dialogReducer,
    visVarselOmManglendeDialog,
    ...rest
}) {
    return (
        <HiddenIfDiv hidden={!visVarselOmManglendeDialog}>
            <Innholdslaster avhengigheter={[identitetReducer, dialogReducer]}>
                <HiddenIfDiv {...rest} hidden={!visVarselOmManglendeDialog}>
                    <AlertStripeAdvarsel className="varsling-boks">
                        <FormattedMessage id="mote.varsling.ingen-dialog" />
                    </AlertStripeAdvarsel>
                </HiddenIfDiv>
            </Innholdslaster>
        </HiddenIfDiv>
    );
}

VarslingBoks.propTypes = {
    identitetReducer: AppPT.reducer.isRequired,
    dialogReducer: AppPT.reducer.isRequired,
    visVarselOmManglendeDialog: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet;
    return {
        identitetReducer: selectIdentitetReducer(state),
        dialogReducer: selectDialogReducer(state),
        visVarselOmManglendeDialog:
            aktivitet.type === MOTE_TYPE &&
            selectErVeileder(state) &&
            !selectDialogForAktivitetId(state, aktivitet.id),
    };
};

export default connect(mapStateToProps)(VarslingBoks);
