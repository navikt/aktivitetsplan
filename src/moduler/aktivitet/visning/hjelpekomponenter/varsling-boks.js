import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import {
    selectDialogForAktivitetId,
    selectDialogStatus,
} from '../../../dialog/dialog-selector';
import * as AppPT from '../../../../proptypes';
import Innholdslaster from '../../../../felles-komponenter/utils/innholdslaster';
import { MOTE_TYPE } from '../../../../constant';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from '../../../identitet/identitet-selector';

function VarslingBoks({ avhengigheter, visVarselOmManglendeDialog, ...rest }) {
    return (
        <HiddenIfDiv hidden={!visVarselOmManglendeDialog}>
            <Innholdslaster avhengigheter={avhengigheter}>
                <HiddenIfDiv {...rest} hidden={!visVarselOmManglendeDialog}>
                    <AlertStripeAdvarsel className="varsling-boks" role="alert">
                        <FormattedMessage id="mote.varsling.ingen-dialog" />
                    </AlertStripeAdvarsel>
                </HiddenIfDiv>
            </Innholdslaster>
        </HiddenIfDiv>
    );
}

VarslingBoks.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    visVarselOmManglendeDialog: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet;
    return {
        avhengigheter: [
            selectIdentitetStatus(state),
            selectDialogStatus(state),
        ],
        visVarselOmManglendeDialog:
            aktivitet.type === MOTE_TYPE &&
            selectErVeileder(state) &&
            !selectDialogForAktivitetId(state, aktivitet.id),
    };
};

export default connect(mapStateToProps)(VarslingBoks);
