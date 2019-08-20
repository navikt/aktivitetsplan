import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { AlertStripeStopp } from 'nav-frontend-alertstriper';
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

function VarslingBoks({
    avhengigheter,
    visVarselOmManglendeDialog,
    className,
}) {
    return (
        <HiddenIfDiv hidden={!visVarselOmManglendeDialog}>
            <Innholdslaster avhengigheter={avhengigheter}>
                <HiddenIfDiv
                    className={className}
                    hidden={!visVarselOmManglendeDialog}
                >
                    <AlertStripeStopp className="varsling-boks" role="alert">
                        <FormattedMessage id="mote.varsling.forhandsorientering" />
                    </AlertStripeStopp>
                </HiddenIfDiv>
            </Innholdslaster>
        </HiddenIfDiv>
    );
}

VarslingBoks.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    visVarselOmManglendeDialog: PT.bool.isRequired,
    className: PT.string.isRequired,
};

const mapStateToProps = (state, props) => {
    const { aktivitet } = props;
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
